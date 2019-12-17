import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import cx from 'classnames/bind';
import {
	getRefHandler,
	restProps
} from '@nti/lib-commons';
import {
	getElementRect as getRectInViewport,
	getEffectiveZIndex,
	getViewportHeight,
	getViewportWidth,
	addClickOutListener
} from '@nti/lib-dom';

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
	ALIGN_LEFT_OR_RIGHT,

	MATCH_SIDE,

	OPEN,
	CLOSED
} from './Constants';
import {
	ALIGNMENT_POSITIONS,
	ALIGNMENT_SIZINGS,
	constrainAlignment,
	getOuterStylesForAlignment,
	getInnerStylesForAlignment,
	getAlignmentClass
} from './utils';
const styles = {
	arrow: 'flyout-arrow',
	closed: 'flyout-closed',
	closing: '',
	dark: '',
	fixed: 'is-fixed',
	flyout: '',
	hover: '',
	open: 'flyout-open',
	opened: '',
	opening: '',
	trigger: 'flyout-trigger',
	wrapper: 'fly-wrapper',
	inner: 'flyout-inner',
	bottom: '',
	top: '',
	center: '',
	left: '',
	right: '',
};

const cxb = cx.bind(styles);

const OPEN_TIMEOUT = 300;
const CLOSE_TIMEOUT = 500;

/**
 * Exported for tests.
 *
 * @param  {DOMNode} element   A dom node to measure
 * @param  {Object}  alignment The alignment description
 * @param  {Rect}    viewport  The viewport rect.
 * @return {Rect} A partial rect.
 */
export function getViewportRelativeAlignments (element, alignment, viewport) {
	//the alignment is relative to the coordinateRoot. We need to constrain to the screen...
	//so we need to get the current screen coordinates.
	const rect = getRectInViewport(element);

	// We now have viewport relative rect, but the alignments omit keys that do not apply...
	// so we must also omit those keys.

	/* istanbul ignore else */
	if (alignment.top != null) { delete rect.bottom; }
	/* istanbul ignore else */
	if (alignment.left != null) { delete rect.right; }
	/* istanbul ignore else */
	if (alignment.bottom != null) { delete rect.top; }
	/* istanbul ignore else */
	if (alignment.right != null) { delete rect.left; }

	// ClientRects left & bottom's are distance from 0,0 (top, left), where
	// "css" bottom & left are the distance from the bottom & left sides..so we have to flip here.
	/* istanbul ignore else */
	if (rect.bottom != null) { rect.bottom = viewport.height - rect.bottom; }
	/* istanbul ignore else */
	if (rect.right != null) { rect.right = viewport.width - rect.right; }

	return rect;
}

function getRectInDocument (el) {
	const offsetParent = e => e && e.offsetParent;
	const parentNode = e => e && e.parentNode && e.parentNode.tagName !== 'BODY' && e.parentNode;

	const offsetParents = e => offsetParent(e)
		? [e].concat(offsetParents(offsetParent(e)))
		: [e];
	const parentNodes = e => parentNode(e)
		? [e].concat(parentNodes(parentNode(e)))
		: [e];

	const sum = s => (a, e) => {
		a.top += e[`${s}Top`];
		a.left += e[`${s}Left`];
		return a;
	};

	const offset = offsetParents(el).reduce(sum('offset'), {top: 0, left: 0});
	const scrolls = parentNodes(el).reduce(sum('scroll'), {top: 0, left: 0});
	const tl = {
		top: offset.top - scrolls.top,
		left: offset.left - scrolls.left
	};

	const sz = {
		width: el.offsetWidth,
		height: el.offsetHeight
	};

	return {
		...tl,
		...sz,
		right: tl.left + sz.width,
		bottom: tl.top + sz.height
	};
}

function getBodyDocumentGaps () {
	const a = document.body.getBoundingClientRect();
	const b = document.body.parentNode.getBoundingClientRect();
	return {
		top: a.top - b.top,
		left: a.left - b.left
	};
}

function getBodySize () {
	const el = document.body;
	const getDim = x => Math.max(el[`client${x}`], el[`offset${x}`]);
	const tl = getBodyDocumentGaps();
	return {
		height: getDim('Height'),
		width: getDim('Width'),
		...tl
	};
}


function isFixed (el) {
	const hasFixedPosition = x => x && x.getAttribute && getComputedStyle(x).position === 'fixed';

	while(el && !hasFixedPosition(el)) {
		el = el.offsetParent;
	}

	return hasFixedPosition(el);
}


/* NOTE: for now the primary axis is always vertical
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
export default class TriggeredFlyout extends React.Component {

	static AXIS = {
		// HORIZONTAL, // Don't expose horizontal for now
		VERTICAL
	}

	static ALIGNMENTS = {
		TOP: ALIGN_TOP,
		BOTTOM: ALIGN_BOTTOM,
		LEFT: ALIGN_LEFT,
		CENTER: ALIGN_CENTER,
		RIGHT: ALIGN_RIGHT,
		LEFT_OR_RIGHT: ALIGN_LEFT_OR_RIGHT
	}

	static SIZES = {
		MATCH_SIDE
	}

	static OPEN = OPEN
	static CLOSED = CLOSED

	static propTypes = {
		trigger: PropTypes.any,
		children: PropTypes.any,
		className: PropTypes.string,
		classes: PropTypes.shape({
			arrow: PropTypes.string,
			closed: PropTypes.string,
			closing: PropTypes.string,
			dark: PropTypes.string,
			fixed: PropTypes.string,
			flyout: PropTypes.string,
			hover: PropTypes.string,
			open: PropTypes.string,
			opened: PropTypes.string,
			opening: PropTypes.string,
			trigger: PropTypes.string,
			wrapper: PropTypes.string,
			inner: PropTypes.string,
			//
			bottom: PropTypes.string,
			top: PropTypes.string,
			center: PropTypes.string,
			left: PropTypes.string,
			right: PropTypes.string,
		}),
		//For now this can only be vertical
		primaryAxis: PropTypes.oneOf([VERTICAL]),
		verticalAlign: PropTypes.oneOf([ALIGN_TOP, ALIGN_BOTTOM, ALIGN_CENTER]),
		horizontalAlign: PropTypes.oneOf([ALIGN_LEFT, ALIGN_RIGHT, ALIGN_LEFT_OR_RIGHT, ALIGN_CENTER]),
		//Set the max-(height|width) to keep the flyout within the window
		constrain: PropTypes.bool,
		sizing: PropTypes.oneOf([MATCH_SIDE]),
		afterAlign: PropTypes.func,
		onDismiss: PropTypes.func,
		arrow: PropTypes.bool,
		dark: PropTypes.bool,

		hover: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.object
		]),

		open: PropTypes.bool,
		defaultState: PropTypes.oneOf([OPEN, CLOSED]),

		transition: PropTypes.shape({
			className: PropTypes.string,
			timeout: PropTypes.number
		})
	}

	static defaultProps = {
		classes: {
			arrow: cxb('arrow'),
			closed: cxb('closed'),
			closing: cxb('closing'),
			dark: cxb('dark'),
			fixed: cxb('fixed'),
			flyout: cxb('flyout'),
			hover: cxb('hover'),
			open: cxb('open'),
			opened: cxb('opened'),
			opening: cxb('opening'),
			trigger: cxb('trigger'),
			wrapper: cxb('wrapper'),
			inner: cxb('inner'),
			bottom: cxb('bottom'),
			top: cxb('top'),
			center: cxb('center'),
			left: cxb('left'),
			right: cxb('right'),
		},
		primaryAxis: 'vertical',
		defaultState: CLOSED
	}


	state = {alignment: {}}


	constructor (props) {
		super(props);

		this.triggerRef = React.createRef();
		this.fly = document.createElement('div');
		this.fly.className = cx(props.classes.wrapper, props.className);
	}


	get trigger () {
		let ref = this.triggerRef.current;
		if (!ref && this.mounted) {
			if (!this.warnedTriggerType) {
				this.warnedTriggerType = true;
				// eslint-disable-next-line no-console
				console.warn(
					'A Stateless Component null ref was returned for the Trigger. Forward its ref to the DOM node.\n%s%s',
					'See: ',
					'https://reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components'
				);
			}
		}

		if (ref instanceof React.Component) {
			if (ref.getDOMNode) {
				return ref.getDOMNode();
			}

			if (!this.warnedTriggerType) {
				this.warnedTriggerType = true;
				// eslint-disable-next-line no-console
				console.warn(
					'A Component ref was returned for the Trigger.\n%s\n%s%s',
					'Implement getDOMNode() or use a Stateless Component with a forwarded ref.',
					'Ref received: ',
					ref.constructor.displayName || ref.constructor.name
				);
			}
			// eslint-disable-next-line react/no-find-dom-node
			ref = ReactDOM.findDOMNode(ref);
		}

		return ref;
	}


	componentDidMount () {
		this.mounted = true;
		document.body.appendChild(this.fly);

		if (this.props.defaultState === OPEN) {
			this.doOpen();
		}
	}


	componentWillUnmount () {
		this.mounted = false;
		document.body.removeChild(this.fly);
	}


	componentDidUpdate (prevProps, prevState) {
		const {
			props: {
				onDismiss,
				classes,
				className,
				open:controlledOpen
			},
			state: {
				open,
				aligning
			},
			fly
		} = this;

		const wasOpen = prevProps.open || prevState.open;
		const isOpen = controlledOpen || open;

		const openInProps = controlledOpen != null;
		const openInPrev = prevProps.open != null;

		if (openInProps !== openInPrev) {
			// eslint-disable-next-line no-console
			console.warn('Flyout was moved from controlled to uncontrolled or vice versa.');
		}

		if (prevProps.className !== className || classes !== prevProps.classes) {
			fly.className = cx(classes.wrapper, className);
		}

		if (prevProps.trigger !== this.props.trigger) {
			delete this.warnedTriggerType;
		}

		if (isOpen && !aligning && this.flyout) {
			const prev = this.flyoutSize;
			const {offsetWidth: width, offsetHeight: height} = this.flyout;
			this.flyoutSize = {width, height};
			if (prev && (prev.width !== width || prev.height !== height)) {
				this.realign();
			}
		}

		if (wasOpen && !isOpen && onDismiss) {
			onDismiss();
		}
	}


	maybeDismiss = (e, cb) => {
		const {target} = e || {};
		const {trigger, flyout} = this;
		const open = this.props.open || this.state.open;
		const targetInTrigger = () => trigger && (trigger.contains(target) || target === trigger);

		if (this.props.open != null) {
			return;
		}

		const finish = () => {
			delete this.flyoutWasClicked;

			if (typeof cb === 'function') {
				cb();
			}
		};

		const preempt = e && (!trigger || !flyout || !open || targetInTrigger());

		if ((!this.flyoutWasClicked && !preempt) && (!e || !targetInTrigger())) {
			this.dismiss(finish);
		}
		else {
			finish();
		}
	}


	dismiss (cb) {
		this.doClose(cb);
	}


	listenToScroll () {
		const {document} = global;

		/* istanbul ignore if */
		if(!document) {
			return;
		}

		const scrollListener = ({target}) => {
			if(target.contains(this.trigger)) {
				this.realign();
			}
		};

		const params = { passive: true, capture: true };

		document.addEventListener('scroll', scrollListener, params);

		this.unlistenToScroll = () => document.removeEventListener('scroll', scrollListener, params);
	}


	// will be filled in on listen
	/* istanbul ignore next */
	unlistenToScroll () {}


	flyoutClicked = () => {
		this.flyoutWasClicked = true;
	}


	attachFlyoutRef = (ref) => {

		/* istanbul ignore else */
		if (ref && !this.flyout) {
			window.addEventListener('resize', this.realign);

			if (this.cleanupClickOut) { this.cleanupClickOut(); }
			this.cleanupClickOut = addClickOutListener(ref, () => this.dismiss());

			this.listenToScroll();
		}

		else if (!ref) {
			delete this.flyoutSize;
			
			window.removeEventListener('resize', this.realign);
			if (this.cleanupClickOut) { this.cleanupClickOut(); }

			this.unlistenToScroll();
		}

		this.flyout = ref;

		if (!ref) { return; }

		//Keep the mount point at the end of the containing node.
		const container = this.fly.parentNode;
		if (container) {
			container.appendChild(this.fly);
		}

		this.align();
	}


	align (cb = this.props.afterAlign) {
		const {
			flyout,
			trigger,
			state: {
				alignment:oldAlignment
			},
			props: {
				primaryAxis,
				verticalAlign,
				horizontalAlign,
				constrain,
				sizing
			}
		} = this;

		const finish = (alignment) => {
			this.setState(
				{aligning: false, alignment},
				typeof cb === 'function' ? cb : void cb
			);
		};

		if (!flyout || !trigger) {
			return finish(oldAlignment);
		}

		const fixed = isFixed(trigger);
		const triggerRect = fixed ? getRectInViewport(trigger) : getRectInDocument(trigger);
		const viewport = {top: 0, left: 0, width: getViewportWidth(), height: getViewportHeight()};
		const coordinateRoot = fixed ? viewport : getBodySize();

		const alignmentPositions = ALIGNMENT_POSITIONS[primaryAxis]
			/* istanbul ignore next */
			|| ALIGNMENT_POSITIONS[VERTICAL];
		const alignmentSizings = ALIGNMENT_SIZINGS[primaryAxis]
			/* istanbul ignore next */
			|| ALIGNMENT_SIZINGS[VERTICAL];

		const layoutArgs = [
			triggerRect,
			flyout,
			coordinateRoot
		];

		const verticalPosition = alignmentPositions[verticalAlign || DEFAULT_VERTICAL](...layoutArgs);
		const horizontalPosition = alignmentPositions[horizontalAlign || DEFAULT_HORIZONTAL](...layoutArgs);
		const flyoutSizing = alignmentSizings[sizing || DEFAULT_SIZING](...layoutArgs);

		let newAlignment = {
			...verticalPosition,
			...horizontalPosition,
			...flyoutSizing
		};

		if (constrain) {
			const rect = getViewportRelativeAlignments(this.trigger, newAlignment, viewport);

			const {maxWidth, maxHeight} = constrainAlignment(rect, viewport);
			newAlignment = {
				...newAlignment,
				maxWidth, maxHeight
			};

			//If the flyout is not going to be positioned fixed, let the flyout
			//freely size vertically (only when growing down... for growing upward,
			//we will continue to limit its height)
			if (!fixed && newAlignment.top != null) {
				delete newAlignment.maxHeight;
			}
		}

		finish(newAlignment);
	}


	realign = () => {
		clearTimeout(this.realign.timeout);
		this.realign.timeout = setTimeout(()=> this.setState({aligning: true}, () => this.align()), 50);
	}


	doOpen = (cb) => {
		const callback = () => typeof cb === 'function' && cb();
		const {transition} = this.props;

		if (transition && transition.timeout) {
			this.setState({
				open: true,
				aligning: true,
				opening: true,
				closing: false
			}, () => {
				setTimeout(() => {
					this.setState({
						opening: false
					}, callback);
				}, transition.timeout);
			});
		} else {
			this.setState({
				open: true,
				aligning: true
			}, callback);
		}
	}


	doClose = (cb) => {
		const callback = () => typeof cb === 'function' && cb();
		const {transition} = this.props;

		if (transition && transition.timeout) {
			this.setState({
				closing: true,
				opening: false
			}, () => {
				setTimeout(() => {
					this.setState({
						open: false,
						aligning: true,
						opening: false,
						closing: false
					}, callback);
				}, transition.timeout);
			});
		} else {
			this.setState({
				open: false,
				aligning: true
			}, callback);
		}
	}


	onToggle = (e, cb) => {
		/* istanbul ignore else */
		if (e) {
			if (e.isPropagationStopped()) {
				return;
			}

			e.preventDefault();
			e.stopPropagation();
		}

		if (this.state.open) {
			this.doClose(cb);
		} else {
			this.doOpen(cb);
		}
	}


	isHover () {
		const {hover} = this.props;

		return !!hover;
	}


	get hoverTimeouts () {
		const {hover} = this.props;

		return {
			openTimeout: hover && hover.openTimeout ? hover.openTimeout : OPEN_TIMEOUT,
			closeTimeout: hover && hover.closeTimeout ? hover.closeTimeout : CLOSE_TIMEOUT
		};
	}


	startShow () {
		const {hoverTimeouts} = this;

		clearTimeout(this.showTimeout);
		clearTimeout(this.hideTimeout);

		this.showTimeout = setTimeout(() => {
			this.doOpen();
		}, hoverTimeouts.openTimeout);
	}


	startHide () {
		const {hoverTimeouts} = this;

		clearTimeout(this.showTimeout);
		clearTimeout(this.hideTimeout);

		this.hideTimeout = setTimeout(() => {
			this.doClose();
		}, hoverTimeouts.closeTimeout);
	}


	stopHide () {
		clearTimeout(this.hideTimeout);
	}


	render () {
		const hover = this.isHover();
		const {
			props: {open:controlledOpen, classes, className, ...props},
			state: {open:stateOpen}
		} = this;
		const overrides = {
			...restProps(TriggeredFlyout, props)
		};
		const open = stateOpen || controlledOpen;

		let Trigger = props.trigger;


		if (controlledOpen == null) {
			if (hover) {
				overrides.onMouseEnter = () => this.startShow();
				overrides.onMouseLeave = () => this.startHide();
			} else {
				overrides.onClick = (e) => {
					/* istanbul ignore else */
					if (Trigger && Trigger.props && Trigger.props.onClick) {
						Trigger.props.onClick(e);
					}

					this.onToggle(e);
				};
			}
		}


		if (!Trigger || typeof Trigger === 'string') {
			Trigger = ( <button>{Trigger || 'Trigger'}</button> );
		}

		const {
			props: {className: triggerClassNames} = {},
			ref: parentRef
		} = Trigger;

		overrides.className = cx(
			classes.trigger,
			triggerClassNames,
			className,
			{
				[classes.open]: open,
				[classes.closed]: !open
			}
		);

		const trigger = React.isValidElement(Trigger)
			? React.cloneElement(Trigger, {...overrides, ref: getRefHandler(parentRef, this.triggerRef)})
			: ( <Trigger ref={this.triggerRef} {...overrides} /> );


		return (
			<React.Fragment>
				{trigger}
				{open && this.renderFlyout()}
			</React.Fragment>
		);
	}


	renderFlyout () {
		const {
			props: {classes, className, arrow, primaryAxis, verticalAlign, horizontalAlign, dark, hover, transition},
			state: {aligning, alignment, opening, closing}
		} = this;
		const {trigger} = this;
		const fixed = isFixed(trigger);
		const effectiveZ = getEffectiveZIndex(trigger);
		const {width} = alignment;
		const flyoutStyle = {
			position: fixed ? 'fixed' : 'absolute',
			visibility: aligning ? 'hidden' : void 0,
			zIndex: effectiveZ ? (effectiveZ + 1) : void 0,
			...(aligning ? {top: 0, left: 0, width} : getOuterStylesForAlignment(alignment, arrow, primaryAxis))
		};

		const innerStyle = getInnerStylesForAlignment(alignment, arrow, primaryAxis);

		const css = cx(
			classes.flyout,
			className,
			(transition && transition.className) || '',
			getAlignmentClass(alignment, verticalAlign, horizontalAlign, classes),
			{
				[classes.arrow]: arrow,
				[classes.dark]: dark,
				[classes.fixed]: fixed,
				[classes.hover]: hover,
				[classes.closing]: closing,
				[classes.opening]: opening,
				[classes.opened]: !opening && !closing
			});

		const listeners = !this.isHover() ? {} : {
			onMouseEnter: () => this.stopHide(),
			onMouseLeave: () => this.startHide(),
		};

		const flyout = (
			<div className={css} ref={this.attachFlyoutRef} style={flyoutStyle} {...listeners} >
				{arrow && <div className={classes.arrow}/>}
				<div className={classes.inner} style={innerStyle}>
					{this.renderContent()}
				</div>
			</div>
		);

		return ReactDOM.createPortal(flyout, this.fly);
	}


	renderContent () {
		const {children} = this.props;

		if (React.Children.count(children) !== 1) { return children; }

		const child = React.Children.only(children);

		return typeof child.type === 'string'
			? child // dom element
			: React.cloneElement(child, {onDismiss: this.doClose}); // react component
	}
}
