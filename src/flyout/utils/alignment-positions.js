import {
	DEFAULT_VERTICAL,
	DEFAULT_HORIZONTAL,
	VERTICAL,
	// HORIZONTAL,
	ALIGN_TOP,
	ALIGN_BOTTOM,
	ALIGN_LEFT,
	ALIGN_CENTER,
	ALIGN_RIGHT,
	ALIGN_LEFT_OR_RIGHT,
} from '../Constants';

import getPseudoElementSpace from './get-pseudo-element-space';

/**
 * @typedef {object} ViewSize
 * @property {number} height
 * @property {number} width
 */

/**
 * @typedef {object} Margin
 * @property {number} top
 * @property {number} bottom
 * @property {number} left
 * @property {number} right
 */

/**
 * @typedef {object} Alignment
 * @property {number?} top
 * @property {number?} bottom
 * @property {number?} left
 * @property {number?} right
 */

/**
 * @typedef {(triggerRect: DOMRect, flyout: HTMLElement, view: ViewSize, reserved: Margin?) => Alignment} AlignmentCalculator
 * @param triggerRect the rect for the trigger
 * @param flyout the flyout dom node
 * @param view the size of the viewport
 * @param reserved the space to reserve between the edge of the screen
 * @returns {Alignment} the vertical positioning
 */

export const ALIGNMENT_POSITIONS = {
	//TODO: add horizontal positioning
	[VERTICAL]: {
		/**
		 * Align the bottom of the flyout to the top of the trigger.
		 * Use the bottom positioning to allow it to grow upwards.
		 *
		 * 		|  Flyout  |
		 * 		------------
		 * 		------------
		 * 		|  Trigger |
		 *
		 * @type {AlignmentCalculator}
		 */
		[ALIGN_TOP]({ top }, flyout, { height: viewHeight }) {
			return {
				top: null,
				bottom: viewHeight - top,
			};
		},

		/**
		 * Align the top of the flyout to the bottom of the trigger.
		 * Use the top positioning to allow it to grow downwards.
		 *
		 * 		|  Trigger |
		 * 		------------
		 * 		------------
		 * 		|  Flyout  |
		 *
		 * @type {AlignmentCalculator}		 *
		 */
		[ALIGN_BOTTOM]({ bottom }) {
			return {
				top: bottom,
				bottom: null,
			};
		},

		/**
		 * Align the flyout to the top or bottom based on how much available space if there.
		 *
		 * If the height of the flyout will fit below the trigger, put it below.
		 * Else if the height of the flyout will fit above the trigger, put it there.
		 * Else put it to which side has the most space.
		 *
		 * @type {AlignmentCalculator}
		 */
		[DEFAULT_VERTICAL](
			{ top, bottom },
			flyout,
			{ height: viewHeight },
			reservedMargin
		) {
			const flyoutHeight =
				flyout.offsetHeight - getPseudoElementSpace(flyout);
			const { top: reservedTop, bottom: reservedBottom } =
				reservedMargin || {};

			const topSpace = top - (reservedTop || 0);
			const bottomSpace = viewHeight - bottom - (reservedBottom || 0);

			const bottomAlignment = ALIGNMENT_POSITIONS[VERTICAL][ALIGN_BOTTOM](
				...arguments
			);
			const topAlignment = ALIGNMENT_POSITIONS[VERTICAL][ALIGN_TOP](
				...arguments
			);

			let position;

			if (bottomSpace >= flyoutHeight) {
				position = bottomAlignment;
			} else if (topSpace >= flyoutHeight) {
				position = topAlignment;
			} else {
				position =
					bottomSpace >= topSpace ? bottomAlignment : topAlignment;
			}

			return position;
		},

		/**
		 * Align the left of the flyout to the left of the trigger.
		 * Use the left position so it will grow right.
		 *
		 * 		|  Trigger |
		 * 		------------
		 * 		----------------
		 * 		|  Flyout      |
		 *
		 * @type {AlignmentCalculator}
		 */
		[ALIGN_LEFT]({ left }) {
			return {
				left: left,
				right: null,
			};
		},

		/**
		 * Align the right of the flyout to the right of the trigger.
		 * Use the right position so it will grow left.
		 *
		 * 		    |  Trigger |
		 * 		    ------------
		 * 		----------------
		 * 		|  Flyout      |
		 *
		 * @type {AlignmentCalculator}
		 */
		[ALIGN_RIGHT]({ right }, flyout, { width: viewWidth }) {
			return {
				left: null,
				right: viewWidth - right,
			};
		},

		/**
		 * @type {AlignmentCalculator}
		 */
		[ALIGN_LEFT_OR_RIGHT](
			{ left, right },
			{ offsetWidth: flyoutWidth },
			{ width: viewWidth }
		) {
			const leftSpace = left;
			const rightSpace = viewWidth - right;

			const leftAlignment = ALIGNMENT_POSITIONS[VERTICAL][ALIGN_LEFT](
				...arguments
			);
			const rightAlignment = ALIGNMENT_POSITIONS[VERTICAL][ALIGN_RIGHT](
				...arguments
			);

			let position;

			if (rightSpace >= flyoutWidth) {
				position = leftAlignment;
			} else if (leftSpace >= flyoutWidth) {
				position = rightAlignment;
			} else {
				position =
					leftSpace >= rightSpace ? rightAlignment : leftAlignment;
			}

			return position;
		},

		/**
		 * Align the center of the flyout to the center of the trigger.
		 *
		 * 		  |  Trigger |
		 * 		  ------------
		 * 		----------------
		 * 		|  Flyout      |
		 *
		 * -OR-
		 *
		 * 		|  Trigger      |
		 * 		----------------
		 * 		  ------------
		 * 		  |  Flyout |
		 *
		 * @type {AlignmentCalculator}
		 */
		[ALIGN_CENTER](
			{ left, width: triggerWidth },
			{ offsetWidth: flyoutWidth }
		) {
			const triggerMid = Math.floor(triggerWidth / 2);
			const flyoutMid = Math.floor(flyoutWidth / 2);

			return {
				left: left + (triggerMid - flyoutMid),
				right: null,
			};
		},

		/**
		 * Default to ALIGN_CENTER
		 *
		 * @type {AlignmentCalculator}
		 */
		[DEFAULT_HORIZONTAL](...args) {
			return ALIGNMENT_POSITIONS[VERTICAL][ALIGN_CENTER](...args);
		},
	},
};
