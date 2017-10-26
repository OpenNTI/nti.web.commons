import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

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
	getAlignmentClass
} from './utils';

function getRelativeRect (elementRect, parentRect) {
	const top = elementRect.top - parentRect.top;
	const left = elementRect.left - parentRect.left;

	return  {
		top,
		left,
		right: left + elementRect.width,
		bottom: top + elementRect.height,
		width: elementRect.width,
		height: elementRect.height
	};
}


function getAlignmentInfoForParent (alignTo, parent) {
	const alignToRect = alignTo.getBoundingClientRect();
	const parentRect = parent.getBoundingClientRect();
	const relativeRect = getRelativeRect(alignToRect, parentRect);

	return {
		alignToRect: relativeRect,
		viewport: parentRect,
		coordinateRoot: parentRect
	};
}


function getAlignmentInfoForViewport () {
	//TODO: fill this in from Triggered's align once its is set up to use this component
	return {};
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


	state = {alignment: null, visible: false}


	componentDidUpdate (oldProps) {
		const {visible, alignTo:newAlign} = this.props;
		const {alignTo:oldAlign} = oldProps;

		if (visible && newAlign !== oldAlign) {
			this.align();
		}
	}


	attachFlyoutRef = (ref) => {
		this.flyout = ref;

		if (ref) {
			this.align();
		}
	}


	align (cb = this.props.afterAlign) {
		const {alignment:oldAlignment} = this.state;
		const finish = (alignment) => {
			this.setState(
				{alignment},
				typeof cb === 'function' ? cb : void cb
			);
		};

		if (!this.flyout) {
			finish(oldAlignment);
		}

		const {alignTo, parent, reservedMargin} = this.props;
		const {alignToRect, coordinateRoot} = parent ? getAlignmentInfoForParent(alignTo, parent) : getAlignmentInfoForViewport(alignTo);
		const {primaryAxis, verticalAlign, horizontalAlign, constrain, sizing} = this.props;

		const alignmentPositions = ALIGNMENT_POSITIONS[primaryAxis || VERTICAL];
		const alignmentSizings = ALIGNMENT_SIZINGS[primaryAxis || VERTICAL];

		const layoutArgs = [
			alignToRect,
			this.flyout,
			coordinateRoot,
			reservedMargin
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
			//TODO: fill this out
		}

		finish(newAlignment);
	}


	render () {
		const {children, visible, className, arrow, dark, primaryAxis, verticalAlign, horizontalAlign, alignToArrow} = this.props;
		const {alignment} = this.state;

		if (!visible) { return null; }

		const outerStyle = {
			visibility: alignment ? void 0 : 'hidden',
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
