import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames/bind';
import {getEffectiveZIndex} from '@nti/lib-dom';
import {restProps} from '@nti/lib-commons';

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

	ClassHooks
} from './Constants';
import {
	ALIGNMENT_POSITIONS,
	ALIGNMENT_SIZINGS,
	constrainAlignment,
	getOuterStylesForAlignment,
	getInnerStylesForAlignment,
	getAlignmentClass,
	getAlignmentInfo,
	getViewportRelativeAlignments,
} from './utils';

const classHooks = cx.bind(ClassHooks);

//TODO: Change triggered to use this under the hood


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
export default class AlignedFlyout extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.node,

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

		visible: PropTypes.bool,
		arrow: PropTypes.bool,
		alignToArrow: PropTypes.bool,
		dark: PropTypes.bool,
		menu: PropTypes.bool,

		alignTo: PropTypes.shape({
			getBoundingClientRect: PropTypes.func,
			offsetParent: PropTypes.object,
			parentNode: PropTypes.object
		}).isRequired,
		parent: PropTypes.shape({
			getBoundingClientRect: PropTypes.func
		}),

		//For now this can only be vertical
		primaryAxis: PropTypes.oneOf([VERTICAL]),
		verticalAlign: PropTypes.oneOf([ALIGN_TOP, ALIGN_BOTTOM, ALIGN_CENTER]),
		horizontalAlign: PropTypes.oneOf([ALIGN_LEFT, ALIGN_RIGHT, ALIGN_CENTER, ALIGN_LEFT_OR_RIGHT]),

		//Set the max-(height|width) to keep the flyout within the parent
		constrain: PropTypes.bool,
		sizing: PropTypes.oneOf([MATCH_SIDE]),

		reservedMargin: PropTypes.object,

		transition: PropTypes.shape({
			className: PropTypes.string,
			timeout: PropTypes.number
		}),

		afterAlign: PropTypes.func,
		onFlyoutSetup: PropTypes.func,
		onFlyoutTearDown: PropTypes.func
	}

	static defaultProps = {
		classes: {
			arrow: classHooks('arrow'),
			closed: classHooks('closed'),
			closing: classHooks('closing'),
			dark: classHooks('dark'),
			fixed: classHooks('fixed'),
			flyout: classHooks('flyout'),
			hover: classHooks('hover'),
			open: classHooks('open'),
			opened: classHooks('opened'),
			opening: classHooks('opening'),
			trigger: classHooks('trigger'),
			wrapper: classHooks('wrapper'),
			inner: classHooks('inner'),
			bottom: classHooks('bottom'),
			top: classHooks('top'),
			center: classHooks('center'),
			left: classHooks('left'),
			right: classHooks('right'),
		},
		primaryAxis: VERTICAL
	}


	attachFlyoutRef = (ref) => {
		const oldFlyout = this.flyout;
		const hadFlyout = !!this.flyout;

		this.flyout = ref;

		if (ref && !hadFlyout) {
			this.setupFlyout(ref);
		} else if (!ref) {
			this.teardownFlyout(oldFlyout);
		}
	}

	state = {alignment: null, visible: false}


	constructor (props) {
		super(props);

		if (!props.parent) {
			this.fly = document.createElement('div');
			this.fly.className = cx(props.className);
		}
	}


	componentDidMount () {
		this.mounted = true;

		if (this.fly) {
			document.body.appendChild(this.fly);
		}

		if (this.props.visible) {
			this.doShow();
		}
	}


	componentWillUnmount () {
		this.mounted = false;

		if (this.fly) {
			// document.body.removeChild(this.fly);
		}
	}


	componentDidUpdate (oldProps) {
		const {visible, alignTo:newAlign, parent} = this.props;
		const {alignTo:oldAlign, parent:oldParent, visible: oldVisible} = oldProps;

		if (!parent && oldParent) {
			this.fly = document.createElement('div');
			this.fly.className = cx(this.props.className);
			document.body.appendChild(this.fly);
		}

		if (visible && !oldVisible) {
			this.doShow();
		} else if (!visible && oldVisible) {
			this.doHide();
		} else if (newAlign !== oldAlign) {
			this.realign();
		}
	}


	listenToScroll () {
		if (typeof document === 'undefined') { return; }

		const scrollListener = () => this.realign();
		const params = {passive: true, capture: true};


		document.addEventListener('scroll', scrollListener, params);
		this.unlistenToScroll = () => document.removeEventListener('scroll', scrollListener, params);
	}


	setupFlyout (ref) {
		window.addEventListener('resize', this.realign);
		this.listenToScroll();

		const {onFlyoutSetup} = this.props;
		const container = this.fly && this.fly.parentNode;

		if (container) {
			container.appendChild(this.fly);
		}

		this.align();

		if (onFlyoutSetup) {
			onFlyoutSetup(ref);
		}
	}


	teardownFlyout (ref) {
		const {onFlyoutTearDown} = this.props;

		window.removeEventListener('resize', this.realign);

		if (this.unlistenToScroll) {
			this.unlistenToScroll();
		}

		if (onFlyoutTearDown) {
			onFlyoutTearDown(ref);
		}
	}

	doShow () {
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
					});
				}, transition.timeout);
			});
		} else {
			this.setState({
				open: true,
				aligning: true
			});
		}
	}


	doHide () {
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
					});
				}, transition.timeout);
			});
		} else {
			this.setState({
				open: false,
				aligning: true
			});
		}
	}


	realign = () => {
		if (this.realign.timeout) { return; }

		this.realign.timeout = setTimeout(() => {
			this.setState({
				aligning: true
			}, () => this.align());
		}, 50);
	}


	align (cb = this.props.afterAlign) {
		const {alignment:oldAlignment} = this.state;
		const finish = (alignment) => {
			this.setState(
				{alignment, aligning: false},
				typeof cb === 'function' ? cb : void cb
			);
		};

		if (!this.flyout) {
			finish(oldAlignment);
		}

		const {
			alignTo,
			parent,
			reservedMargin,
			primaryAxis, verticalAlign, horizontalAlign, constrain, sizing
		} = this.props;

		const {alignToRect, coordinateRoot, isFixed} = getAlignmentInfo(alignTo, parent);

		const layoutArgs = [
			alignToRect,
			this.flyout,
			coordinateRoot,
			reservedMargin
		];

		const alignmentPositions = ALIGNMENT_POSITIONS[primaryAxis || VERTICAL];
		const alignmentSizings = ALIGNMENT_SIZINGS[primaryAxis || VERTICAL];

		const verticalPosition = alignmentPositions[verticalAlign || DEFAULT_VERTICAL](...layoutArgs);
		const horizontalPosition = alignmentPositions[horizontalAlign || DEFAULT_HORIZONTAL](...layoutArgs);
		const flyoutSizing = alignmentSizings[sizing || DEFAULT_SIZING](...layoutArgs);

		let newAlignment = {
			...verticalPosition,
			...horizontalPosition,
			...flyoutSizing,
			isFixed
		};


		if (constrain) {
			const rect = getViewportRelativeAlignments(alignTo, newAlignment, coordinateRoot);

			const {maxWidth, maxHeight} = constrainAlignment(rect, coordinateRoot);

			newAlignment = {...newAlignment, maxWidth, maxHeight};

			//If the flyout is not going to be positioned fixed, let the flyout
			//freely size vertically (only when growing down... for growing upward,
			//we will continue to limit its height)
			if (!isFixed && newAlignment.top != null) {
				delete newAlignment.maxHeight;
			}
		}

		finish(newAlignment);
	}


	render () {
		const {
			alignTo,
			className,
			children,
			arrow,
			dark,
			menu,
			primaryAxis,
			verticalAlign,
			horizontalAlign,
			alignToArrow,
			classes,
			transition,
			...otherProps
		} = this.props;

		const flyoutProps = {...restProps(AlignedFlyout, otherProps) };
		const {alignment, aligning, open, opening, closing} = this.state;

		if (!open) { return null; }

		const {isFixed} = alignment || {};
		const effectiveZ = getEffectiveZIndex(alignTo);

		const outerStyles = {
			//if the alignment isn't fixed, or we are rendering to a parent keep the position absolute
			position: isFixed && this.fly ? 'fixed' : 'absolute',
			visibility: aligning || !alignment ? 'hidden' : void 0,
			zIndex: effectiveZ ? (effectiveZ + 1) : void 0,
			...(!alignment ? {top: 0, left: 0} : getOuterStylesForAlignment(alignment || {}, arrow, primaryAxis, alignToArrow))
		};
		const innerStyle = getInnerStylesForAlignment(alignment || {}, arrow, primaryAxis);
		const cls = cx(
			'aligned-flyout',
			className,
			(transition && transition.className) || '',
			getAlignmentClass(alignment || {}, verticalAlign, horizontalAlign, classes),
			{
				arrow,
				dark,
				[classes.arrow]: arrow,
				[classes.dark]: dark,
				[classes.fixed]: isFixed,
				[classes.closing]: closing,
				[classes.opening]: opening
			}
		);

		if (!menu) {
			flyoutProps['aria-role'] = 'dialog';
		}

		const flyout = (
			<div
				{...flyoutProps}
				aria-expanded="true"
				className={cls}
				ref={this.attachFlyoutRef}
				style={outerStyles}
			>
				{arrow && (<div className="flyout-arrow" />)}
				<div className="flyout-inner" style={innerStyle}>
					{children}
				</div>
			</div>
		);

		return this.fly ? ReactDOM.createPortal(flyout, this.fly) : flyout;
	}
}
