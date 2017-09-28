import {ARROW_HEIGHT, VERTICAL} from '../Constants';

export default function getInnerStylesForAlignment (alignment, arrow, primaryAxis) {
	let {maxWidth, maxHeight} = alignment;

	if (primaryAxis === VERTICAL && arrow) {
		maxHeight = maxHeight - ARROW_HEIGHT;
	}

	//TODO: figure out what to do for horizontal alignment

	return {
		maxWidth: maxWidth ? `${maxWidth}px` : null,
		maxHeight: maxHeight ? `${maxHeight}px` : null
	};
}
