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

/**
 * Functions to compute the different types of alignments
 * @type {Object}
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
		 * @type {Function}
		 * @param {Object} triggerRect the rect for the trigger
		 * @param {Object} flyout the flyout dom node
		 * @param {Object} viewSize the size of the viewport
		 * @return {Object} the vertical positioning
		 */
		[ALIGN_TOP] ({top}, flyout, {height:viewHeight}) {
			return {
				top: null,
				bottom: viewHeight - top
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
		 * @type {Function}
		 * @param {Object} triggerRect the rect for the trigger
		 * @param {Object} flyout the flyout dom node
		 * @param {Object} viewSize the size of the viewport
		 * @return {Object} the vertical positioning
		 */
		[ALIGN_BOTTOM] ({bottom}) {
			return {
				top: bottom,
				bottom: null
			};
		},

		/**
		 * Align the flyout to the top or bottom based on how much available space if there.
		 *
		 * If the height of the flyout will fit below the trigger, put it below.
		 * Else if the height of the flyout will fit above the trigger, put it there.
		 * Else put it to which side has the most space.
		 *
		 * @type {Function}
		 * @param {Object} triggerRect the rect for the trigger
		 * @param {Object} flyout the flyout dom node
		 * @param {Object} viewSize the size of the viewport
		 * @return {Object} the vertical positioning
		 */
		[DEFAULT_VERTICAL] ({top, bottom}, {offsetHeight: flyoutHeight}, {height: viewHeight}) {
			const topSpace = top;
			const bottomSpace = viewHeight - bottom;

			const bottomAlignment = ALIGNMENT_POSITIONS[VERTICAL][ALIGN_BOTTOM]({bottom});
			const topAlignment = ALIGNMENT_POSITIONS[VERTICAL][ALIGN_TOP]({top}, void 0, {height: viewHeight});

			let position;

			if (bottomSpace >= flyoutHeight) {
				position = bottomAlignment;
			} else if (topSpace >= flyoutHeight) {
				position = topAlignment;
			} else {
				position = bottomSpace >= topSpace ? bottomAlignment : topAlignment;
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
		 * @type {Function}
		 * @param {Object} triggerRect the rect for the trigger
		 * @param {Object} flyout the flyout dom node
		 * @param {Object} viewSize the size of the viewport
		 * @return {Object} the horizontal positioning
		 */
		[ALIGN_LEFT] ({left}) {
			return {
				left: left,
				right: null
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
		 * @type {Function}
		 * @param {Object} triggerRect the rect for the trigger
		 * @param {Object} flyout the flyout dom node
		 * @param {Object} viewSize the size of the viewport
		 * @return {Object} the horizontal positioning
		 */
		[ALIGN_RIGHT] ({right}, flyout, {width: viewWidth}) {
			return {
				left: null,
				right: viewWidth - right
			};
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
		 * @type {Function}
		 * @param {Object} triggerRect the rect for the trigger
		 * @param {Object} flyout the flyout dom node
		 * @param {Object} viewSize the size of the viewport
		 * @return {Object} the horizontal positioning
		 */
		[ALIGN_CENTER] ({left, width:triggerWidth}, {offsetWidth: flyoutWidth}) {
			const triggerMid = Math.floor(triggerWidth / 2);
			const flyoutMid = Math.floor(flyoutWidth / 2);

			return {
				left: left + (triggerMid - flyoutMid),
				right: null
			};
		},


		/**
		 * Default to ALIGN_CENTER
		 *
		 * @type {Function}
		 * @return {Object} the horizontal positioning
		 */
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


export function constrainAlignment (alignment = {}, {height: viewHeight, width: viewWidth}) {
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
