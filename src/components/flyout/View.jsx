import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import {getEffectiveZIndex, getViewportHeight, getViewportWidth, getScrollParent} from 'nti-lib-dom';
import {
	DEFAULT_VERTICAL,
	DEFAULT_HORIZONTAL,
	DEFAULT_SIZING,

	VERTICAL,
	// HORIZONTAL,

	ALIGN_TOP,
	ALIGN_BOTTOM,
	ALIGN_LEFT,
	ALIGN_CENTER,
	ALIGN_RIGHT,

	MATCH_SIDE
} from './Constants';

import {
	ALIGNMENT_POSITIONS,
	ALIGNMENT_SIZINGS,
	constrainAlignment,
	getOuterStylesForAlignment,
	getInnerStylesForAlignment,
	getAlignmentClass
} from './utils';


const {createElement: ce} = global.document || {};
const makeDOM = o => ce && Object.assign(ce.call(document, o.tag || 'div'), o);

function getRect (el) {
	const rect = el.getBoundingClientRect();
	const p = e => e && e.offsetParent;
	const r = e => p(e) ? [e].concat(r(p(e))) : [e];
	const sum = (a, e) => (a.top += e.offsetTop, a.left += e.offsetLeft, a);

	return r(el).reduce(sum, {
		left: 0,
		top: 0,
		width: rect.width,
		height: rect.height,
		get right () { return this.left + this.width; },
		get bottom () { return this.top + this.height; }
	});
}


function isFixed (el) {
	const hasFixedPosition = x => x && getComputedStyle(x).position === 'fixed';

	while(el && !hasFixedPosition(el)) {
		el = el.offsetParent;
	}

	return hasFixedPosition(el);
}


/**
 * NOTE: for now the primary axis is always vertical
 *
 * The primary alignment should behave as follows:
 * 		If primary axis alignment is NOT passed:
 * 			1.) The primary axis alignment will be set to which ever side has the most space
 * 		 	(i.e if the primary axis is vertical if the trigger is closer to the bottom
 * 		  	of the window the flyout will open to the top)
 *
 * 		If primary axis alignment is passed:
 * 			1.) The primary axis alignment will be forced to that side.
 *
 *
 * The secondary alignment defaults to center and behaves like:
 *
 * 		Align the same point on the flyout to the same point on the trigger.
 *
 *		CASES:
 *			'left': the left edge of the flyout is aligned to the left edge of the trigger
 *			'center': the center of the flyout is aligned to the center of the trigger
 *			'right': the right edge of the flyout is aligned to the right edge of the trigger
 *			'top': the top edge of the flyout is aligned to the top edge of the trigger
 *			'bottom': the bottom edge of the flyout is aligned to the bottom edge of the trigger
 */
export default class Flyout extends React.Component {

	static AXIS = {
		// HORIZONTAL, // Don't expose horizontal for now
		VERTICAL
	}

	static ALIGNMENTS = {
		TOP: ALIGN_TOP,
		BOTTOM: ALIGN_BOTTOM,
		LEFT: ALIGN_LEFT,
		CENTER: ALIGN_CENTER,
		RIGHT: ALIGN_RIGHT
	}

	static SIZES = {
		MATCH_SIDE
	}

	static propTypes = {
		trigger: PropTypes.any,
		children: PropTypes.any,
		className: PropTypes.string,
		//For now this can only be vertical
		primaryAxis: PropTypes.oneOf([VERTICAL]),
		verticalAlign: PropTypes.oneOf([ALIGN_TOP, ALIGN_BOTTOM, ALIGN_CENTER]),
		horizontalAlign: PropTypes.oneOf([ALIGN_LEFT, ALIGN_RIGHT, ALIGN_CENTER]),
		//Set the max-(height|width) to keep the flyout within the window
		constrain: PropTypes.bool,
		sizing: PropTypes.oneOf([MATCH_SIDE]),
		afterAlign: PropTypes.func,
		onDismiss: PropTypes.func,
		arrow: PropTypes.bool
	}

	static defaultProps = {
		primaryAxis: 'vertical'
	}


	constructor (props) {
		super(props);
		this.state = {alignment: {}};
		this.fly = makeDOM({className: cx('fly-wrapper', props.className)});
		this.onToggle = this.onToggle.bind(this);
		this.attachFlyoutRef = this.attachFlyoutRef.bind(this);
		this.maybeDismiss = this.maybeDismiss.bind(this);

		this.realign = () => {
			clearTimeout(this.realign.timeout);
			this.realign.timeout = setTimeout(()=> this.align(), 50);
		};
	}


	get trigger () {
		return ReactDOM.findDOMNode(this);
	}


	componentDidMount () {
		document.body.appendChild(this.fly);
	}


	componentWillUnmount () {
		ReactDOM.unmountComponentAtNode(this.fly);
		document.body.removeChild(this.fly);
	}


	componentWillReceiveProps (nextProps) {
		if (nextProps.className !== this.props.className) {
			this.fly.className = cx('fly-wrapper', nextProps.className);
		}
	}


	componentDidUpdate (prevProps, prevState) {
		const {props: {onDismiss}, state: {open}} = this;
		const {open: wasOpen} = prevState;

		if (open) {
			this.renderFlyout();
		} else {
			ReactDOM.unmountComponentAtNode(this.fly);
		}

		if (wasOpen && !open && onDismiss) {
			onDismiss();
		}
	}


	maybeDismiss (e, cb) {
		const {target} = e || {};
		const {trigger, flyout, state: {open}} = this;
		const finish = () => typeof cb === 'function' && cb();
		const inDom = document.contains(target); // If the target was removed from dom after click or rerender it will not be in the dom anymore.

		if (e && (!trigger || !flyout || !open || !inDom || target === trigger || trigger.contains(target))) {
			return finish();
		}

		if (!e || (!flyout.contains(target) && flyout !== target)) {
			this.dismiss(finish);
		} else {
			finish();
		}
	}


	dismiss (cb) {
		this.setState({
			open: false,
			aligning: true
		}, () => {
			if (typeof cb === 'function') {
				cb();
			}
		});
	}


	listenToScroll (scroller) {
		const {scrollparent: old} = this;
		if (old === scroller) {
			return;
		}

		if (old) {
			old.removeEventListener('scroll', this.realign);
		}

		delete this.scrollparent;

		if (scroller) {
			scroller.addEventListener('scroll', this.realign);
			this.scrollparent = scroller;
		}
	}


	attachFlyoutRef (ref) {

		if (ref && !this.flyout) {
			window.addEventListener('resize', this.realign);
			window.document.addEventListener('click', this.maybeDismiss);
			this.listenToScroll(getScrollParent(ref) || window);
		} else if (!ref) {
			window.removeEventListener('resize', this.realign);
			window.document.removeEventListener('click', this.maybeDismiss);
			this.listenToScroll(null);
		}

		this.flyout = ref;

		if (!ref) {return;}

		this.align();
	}


	align (cb = this.props.afterAlign, noRetry = false) {
		const {alignment:oldAlignment} = this.state;
		const finish = (alignment) => {
			this.setState(
				{aligning: false, alignment},
				typeof cb === 'function' ? cb : void cb
			);
		};

		if (!this.flyout) {
			return finish(oldAlignment);
		}

		const triggerRect = getRect(this.trigger);
		const viewport = {width: getViewportWidth(), height: getViewportHeight()};
		const {primaryAxis, verticalAlign, horizontalAlign, constrain, sizing, arrow} = this.props;

		const alignmentPositions = ALIGNMENT_POSITIONS[primaryAxis || VERTICAL];
		const alignmentSizings = ALIGNMENT_SIZINGS[primaryAxis || VERTICAL];

		const verticalPosition = alignmentPositions[verticalAlign || DEFAULT_VERTICAL](triggerRect, this.flyout, viewport);
		const horizontalPosition = alignmentPositions[horizontalAlign || DEFAULT_HORIZONTAL](triggerRect, this.flyout, viewport);
		const flyoutSizing = alignmentSizings[sizing || DEFAULT_SIZING](triggerRect, this.flyout, viewport);

		let newAlignment = {
			...verticalPosition,
			...horizontalPosition,
			...flyoutSizing
		};

		if (constrain) {
			newAlignment = constrainAlignment(newAlignment, viewport, arrow);
		}

		finish(newAlignment);
	}


	onToggle (e, cb) {
		if (e) {
			if (e.isPropagationStopped()) {
				return;
			}

			e.preventDefault();
			e.stopPropagation();
		}

		const {open} = this.state;

		this.setState(
			{ open: !open, aligning: true },
			typeof cb === 'function' ? cb : void cb);
	}


	render () {
		let {trigger: Trigger, ...props} = this.props;

		delete props.children;
		delete props.verticalAlign;
		delete props.horizontalAlign;
		delete props.primaryAxis;
		delete props.constrain;
		delete props.sizing;
		delete props.afterAlign;
		delete props.alignment;
		delete props.className;
		delete props.onDismiss;
		delete props.arrow;

		//TODO: inform the trigger that the flyout is open

		if (!Trigger) {
			Trigger = ( <button>Trigger</button> );
		}

		if (React.isValidElement(Trigger)) {
			const {onClick} = Trigger.props;
			let onToggle = this.onToggle;
			if (onClick) {
				onToggle = e => {
					onClick(e);
					this.onToggle(e);
				};
			}

			return React.cloneElement(Trigger, {onClick: onToggle});
		}

		return (
			<Trigger {...props} onClick={this.onToggle}/>
		);
	}


	renderFlyout () {
		debugger;
		const {
			props: {children, className, arrow, primaryAxis, verticalAlign, horizontalAlign},
			state: {aligning, alignment}
		} = this;
		const {trigger} = this;
		const fixed = isFixed(trigger);
		const effectiveZ = getEffectiveZIndex(trigger);
		const flyoutStyle = {
			position: fixed ? 'fixed' : 'absolute',
			visibility: aligning ? 'hidden' : void 0,
			zIndex: effectiveZ ? (effectiveZ + 1) : void 0,
			...getOuterStylesForAlignment(alignment, arrow, primaryAxis)
		};

		const innerStyle = getInnerStylesForAlignment(alignment, arrow, primaryAxis);

		const css = cx('flyout', className, getAlignmentClass(alignment, verticalAlign, horizontalAlign), {fixed, arrow});

		ReactDOM.render(
			<div className={css} ref={this.attachFlyoutRef} style={flyoutStyle}>
				{arrow && <div className="flyout-arrow"/>}
				<div className="flyout-inner" style={innerStyle}>
					{children}
				</div>
			</div>
		, this.fly, () => {

			if (this.flyout) {
				const {offsetWidth: width, offsetHeight: height} = this.flyout;
				const {dimensions: dim} = alignment;
				if (dim && (dim.width !== width || dim.height !== height)) {
					this.realign();
				}
			}
		});
	}
}
