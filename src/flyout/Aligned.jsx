import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
	getEffectiveZIndex
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

	MATCH_SIDE
} from './Constants';
import {
	ALIGNMENT_POSITIONS,
	ALIGNMENT_SIZINGS,
	getOuterStylesForAlignment,
	getInnerStylesForAlignment,
	getAlignmentClass,
	getAlignmentInfo
} from './utils';


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

		visible: PropTypes.bool,
		arrow: PropTypes.bool,
		alignToArrow: PropTypes.bool,
		dark: PropTypes.bool,

		alignTo: PropTypes.shape({
			getBoundingClientRect: PropTypes.func
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

		afterAlign: PropTypes.func
	}

	static defaultProps = {
		primaryAxis: VERTICAL
	}


	attachFlyoutRef = (ref) => {
		const hadFlyout = !!this.flyout;

		this.flyout = ref;

		if (ref && !hadFlyout) {
			this.setupFlyout();
		} else if (!ref) {
			this.teardownFlyout();
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
	}


	componentWillUnmount () {
		this.mounted = false;

		if (this.fly) {
			document.body.removeChild(this.fly);
		}
	}


	componentDidUpdate (oldProps) {
		const {visible, alignTo:newAlign, parent} = this.props;
		const {alignTo:oldAlign, parent:oldParent} = oldProps;

		if (!parent && oldParent) {
			this.fly = document.createElement('div');
			this.fly.className = cx(this.props.className);
			document.body.appendChild(this.fly);
		}


		if (visible && newAlign !== oldAlign) {
			this.setState({
				aligning: true
			}, () => this.align());
		}
	}


	listenToScroll () {
		if (typeof document === 'undefined') { return; }

		const scrollListener = () => this.realign();
		const params = {passive: true, capture: true};


		document.addEventListener('scroll', scrollListener, params);
		this.unlistenToScroll = () => document.removeEventListener('scroll', scrollListener, params);
	}


	setupFlyout () {
		window.addEventListener('resize', this.realign);
		this.listenToScroll();

		const container = this.fly && this.fly.parentNode;

		if (container) {
			container.appendChild(this.fly);
		}

		this.align();
	}


	teardownFlyout () {
		window.removeEventListener('resize', this.realign);

		if (this.unlistenToScroll) {
			this.unlistenToScroll();
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
			//TODO: fill this out
		}

		finish(newAlignment);
	}


	render () {
		const {
			alignTo,
			className,
			children,
			visible,
			arrow,
			dark,
			primaryAxis,
			verticalAlign,
			horizontalAlign,
			alignToArrow
		} = this.props;

		if (!visible) { return null; }

		const {alignment, aligning} = this.state;

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
		const cls = cx('aligned-flyout', className, getAlignmentClass(alignment || {}, verticalAlign, horizontalAlign), {arrow, dark});

		const flyout = (
			<div className={cls} ref={this.attachFlyoutRef} style={outerStyles}>
				{arrow && (<div className="flyout-arrow" />)}
				<div className="flyout-inner" style={innerStyle}>
					{children}
				</div>
			</div>
		);

		return this.fly ? ReactDOM.createPortal(flyout, this.fly) : flyout;
	}


	xrender () {
		const {children, visible, className, arrow, dark, primaryAxis, verticalAlign, horizontalAlign, alignToArrow} = this.props;
		const {alignment, aligning} = this.state;

		if (!visible) { return null; }

		const outerStyle = {
			visibility: alignment && !aligning ? void 0 : 'hidden',
			...(!alignment ? {top: 0, left: 0} : getOuterStylesForAlignment(alignment || {}, arrow, primaryAxis, alignToArrow))
		};
		const innerStyle = getInnerStylesForAlignment(alignment || {}, arrow, primaryAxis);
		const cls = cx('aligned-flyout', className, getAlignmentClass(alignment || {}, verticalAlign, horizontalAlign), {arrow, dark});

		return (
			<div className={cls} ref={this.attachFlyoutRef} style={outerStyle}>
				{arrow && <div className="flyout-arrow" />}
				<div className="flyout-inner" style={innerStyle}>
					{children}
				</div>
			</div>
		);
	}
}
