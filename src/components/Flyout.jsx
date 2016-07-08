import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import {getEffectiveZIndex, getViewportHeight, getViewportWidth, getScrollParent} from 'nti-lib-dom';

export const DEFAULT_VERTICAL = 'default-vertical';
export const DEFAULT_HORIZONTAL = 'default-horizontal';
export const DEFAULT_SIZING = 'default-sizing';

export const VERTICAL = 'vertical';
export const HORIZONTAL = 'horizontal';

export const ALIGN_TOP = 'top';
export const ALIGN_BOTTOM = 'bottom';
export const ALIGN_LEFT = 'left';
export const ALIGN_CENTER = 'center';
export const ALIGN_RIGHT = 'right';

export const MATCH_SIDE = 'matchSize';

export const ALIGNMENT_POSITIONS = {
	//TODO: add horizontal positioning
	[VERTICAL]: {
		[ALIGN_TOP] ({top}, flyout, {height:viewHeight}) {
			return {
				top: null,
				bottom: viewHeight - top
			};
		},
		[ALIGN_BOTTOM] ({bottom}) {
			return {
				top: bottom,
				bottom: null
			};
		},
		[DEFAULT_VERTICAL] ({top, bottom}, {offsetHeight: flyoutHeight}, {height: viewHeight}) {
			const topSpace = top;
			const bottomSpace = viewHeight - bottom;

			const bottomAlignment = ALIGNMENT_POSITIONS[VERTICAL][ALIGN_BOTTOM]({bottom});
			const topAlignment = ALIGNMENT_POSITIONS[VERTICAL][ALIGN_BOTTOM]({top}, void 0, {height: viewHeight});

			let position;

			if (bottomSpace <= flyoutHeight) {
				position = bottomAlignment;
			} else if (topSpace <= flyoutHeight) {
				position = topAlignment;
			} else {
				position = bottomSpace >= topSpace ? bottomAlignment : topAlignment;
			}

			return position;
		},
		[ALIGN_LEFT] ({left}) {
			return {
				left: left,
				right: null
			};
		},
		[ALIGN_RIGHT] ({right}) {
			return {
				left: null,
				right: right
			};
		},
		[ALIGN_CENTER] ({left, width:triggerWidth}, {offsetWidth: flyoutWidth}) {
			const triggerMid = Math.floor(triggerWidth / 2);
			const flyoutMid = Math.floor(flyoutWidth / 2);

			return {
				left: left + (triggerMid - flyoutMid),
				right: null
			};
		},
		[DEFAULT_HORIZONTAL] (...args) {
			return ALIGNMENT_POSITIONS[VERTICAL][ALIGN_CENTER](...args);
		}
	}
};

export const ALIGNMENT_SIZINGS = {
	//TODO: add horizontal sizing
	[VERTICAL]: {
		[MATCH_SIDE] ({width}) {
			return {
				width: width
			};
		},
		[DEFAULT_SIZING] () {
			return {};
		}
	}
};

const {createElement: ce} = global.document || {};
const makeDOM = o => ce && Object.assign(ce.call(document, o.tag || 'div'), o);

function getRect (el) {
	const p = e => e && e.offsetParent;
	const r = e => p(e) ? [e].concat(r(p(e))) : [e];
	const sum = (a, e) => (a.top += e.offsetTop, a.left += e.offsetLeft, a);

	return r(el).reduce(sum, {
		left: 0,
		top: 0,
		width: el.offsetWidth,
		height: el.offsetHeight,
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


function constrainAlignment (alignment = {}, {height: viewHeight, width: viewWidth}) {
	if (alignment.top != null) {
		alignment.maxHeight = viewHeight - alignment.top;
	} else if (alignment.bottom != null) {
		alignment.maxHeight = viewHeight - alignment.bottom;
	}

	if (alignment.left != null) {
		alignment.maxWidth = viewWidth - alignment.left;
	} else if (alignment.right != null) {
		alignment.maxWidth = viewWidth - alignment.right;
	}

	return alignment;
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
		ALIGN_TOP,
		ALIGN_BOTTOM,
		ALIGN_LEFT,
		ALIGN_CENTER,
		ALIGN_RIGHT
	}

	static SIZE = {
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
		const finish = (alignment) => {
			this.setState(
				{aligning: false, alignment},
				typeof cb === 'function' ? cb : void cb
			);
		};

		if (!this.flyout) {
			return finish();
		}

		const triggerRect = getRect(this.trigger);
		const viewport = {width: getViewportWidth(), height: getViewportHeight()};
		const {primaryAxis, verticalAlign, horizontalAlign, constrain, sizing} = this.props;

		const alignmentPositions = ALIGNMENT_POSITIONS[primaryAxis || VERTICAL];
		const alignmentSizings = ALIGNMENT_SIZINGS[primaryAxis || VERTICAL];

		const verticalPosition = alignmentPositions[verticalAlign || DEFAULT_VERTICAL](triggerRect, this.flyout, viewport);
		const horizontalPosition = alignmentPositions[horizontalAlign || DEFAULT_HORIZONTAL](triggerRect, this.flyout, viewport);
		const flyoutSizing = alignmentSizings[sizing || DEFAULT_SIZING](triggerRect, this.flyout, viewport);

		let alignment = {
			...verticalPosition,
			...horizontalPosition,
			...flyoutSizing
		};

		if (constrain) {
			alignment = constrainAlignment(alignment, viewport);
		}

		//TODO: set state for alignment
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
		delete props.alignment;
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
		const {props: {children, className, arrow}, state: {aligning, alignment}} = this;
		const {trigger} = this;
		const fixed = isFixed(trigger);
		const effectiveZ = getEffectiveZIndex(trigger);
		const style = {
			position: fixed ? 'fixed' : 'absolute',
			visibility: aligning ? 'hidden' : void 0,
			top: alignment.top,
			left: alignment.left,
			zIndex: effectiveZ ? (effectiveZ + 1) : void 0
		};

		const css = cx('flyout', className, alignment.side, {fixed, arrow});

		ReactDOM.render(
			<div className={css} ref={this.attachFlyoutRef} style={style}>
				{arrow && <div className="flyout-arrow"/>}
				{children}
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
