import {getElementRect as getRectInViewport} from '@nti/lib-dom';

/**
 * @param  {DOMNode} element   A dom node to measure
 * @param  {Object}  alignment The alignment description
 * @param  {Rect}    viewport  The viewport rect.
 * @returns {Rect} A partial rect.
 */
export default function getViewportRelativeAlignments (element, alignment, viewport) {
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