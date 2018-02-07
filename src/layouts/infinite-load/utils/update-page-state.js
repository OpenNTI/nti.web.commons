function isInBeforeVisibleRange (top, height, scrollTop, clientHeight) {
	//If the bottom of the page is within a screen height of the scroll top
	const bottom = top + height;

	return bottom >= Math.max(0, scrollTop - clientHeight) && bottom <= scrollTop;
}

function isInCurrentVisibleRange (top, height, scrollTop, clientHeight) {
	const bottom = top + height;
	const bottomBoundary = scrollTop + clientHeight;

	return (top <= scrollTop && bottom >= scrollTop) || //the bottom half of the page is on the screen
		(top <= bottomBoundary && bottom >= bottomBoundary) || //the top half of the page is on the screen
		(top >= scrollTop && top <= bottomBoundary); //the whole page is on the screen
}

function isInAfterVisibleRange (top, height, scrollTop, clientHeight) {
	const bottomBoundary = scrollTop + clientHeight;

	return top >= bottomBoundary && top <= bottomBoundary + clientHeight;
}

function isInVisibleRange (top, height, scrollTop, clientHeight) {
	return isInBeforeVisibleRange(top, height, scrollTop, clientHeight) ||
		isInCurrentVisibleRange(top, height, scrollTop, clientHeight) ||
		isInAfterVisibleRange(top, height, scrollTop, clientHeight);
}

function pagesChanged (pagesA, pagesB) {
	if (pagesA.length !== pagesB.length) { return true; }

	for (let i = 0; i < pagesA.length; i++) {
		const pageA = pagesA[i];
		const pageB = pagesB[i];

		if (pageA.key !== pageB.key) {
			return true;
		}
	}

	return false;
}


export default  function updatePages (pageState, buffer, scrollingEl, getPageHeight) {
	const {pages, visiblePages:currentVisible} = pageState;
	const {scrollTop, clientHeight} = scrollingEl;

	let newVisible = [];

	let distanceFromTop = 0;
	let visibleOffset = 0;

	for (let page of pages) {
		const height = getPageHeight(page);
		const visible = isInVisibleRange(distanceFromTop, height, scrollTop, clientHeight);

		if (visible) {
			if (!newVisible.length) {
				visibleOffset = distanceFromTop;
			}

			newVisible.push(page);
		}

		distanceFromTop += height;
	}

	if (!pagesChanged(currentVisible, newVisible)) {
		return pageState;
	}

	// console.log(currentVisible, newVisible, visibleOffset, distanceFromTop);

	return {
		pages,
		visiblePages: newVisible,
		visibleOffset,
		totalHeight: distanceFromTop
	};
}
