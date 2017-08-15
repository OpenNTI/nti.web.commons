import adjustHeight from './adjust-height';

function getMinTop () {
	return 10;
}

function getMaxHeight (viewHeight, minTop, bottomPadding) {
	return viewHeight - minTop - bottomPadding;
}

export default function getScrollOffsetForRect (rect, viewportHeight, topPadding, bottomPadding) {
	const top = Math.floor(rect.top);
	const height = Math.floor(rect.height);

	const minTop = getMinTop() + topPadding;
	const adjustedHeight = adjustHeight(height);
	const maxHeight = getMaxHeight(viewportHeight, minTop, bottomPadding);

	let offset = 0;

	//If its too tall to completely fit on screen position it at the top
	//and let it scroll
	if (adjustedHeight > maxHeight) {
		offset = top - minTop;
	//If its not too tall but partly above the top, position at the top
	} else if (top < minTop) {
		offset = top - minTop;
	//if its not too tall but partly below the top, move it up so the bottom show
	} else if (top + adjustedHeight > maxHeight) {
		offset = (top + adjustedHeight) - maxHeight;
	}
	//If none of these conditions are met the entirety is visible on the screen
	//so don't move it at all

	return offset;
}
