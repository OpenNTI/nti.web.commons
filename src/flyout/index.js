import {

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


export const AXIS = {
	// HORIZONTAL, // Don't expose horizontal for now
	VERTICAL
};

export const ALIGNMENTS = {
	TOP: ALIGN_TOP,
	BOTTOM: ALIGN_BOTTOM,
	LEFT: ALIGN_LEFT,
	CENTER: ALIGN_CENTER,
	RIGHT: ALIGN_RIGHT,
	LEFT_OR_RIGHT: ALIGN_LEFT_OR_RIGHT
};

export const SIZES = {
	MATCH_SIDE
};


export { default as InlineFlyout } from './Inline';
export { default as Triggered } from './Triggered';
export { default as Aligned } from './Aligned';

export { default as ZBooster } from './ZBooster';
