// function isInBeforeVisibleRange (top, height, scrollTop, clientHeight) {
// 	//If the bottom of the page is within a screen height of the scroll top
// 	const bottom = top + height;

// 	return bottom >= Math.max(0, scrollTop - clientHeight) && bottom <= scrollTop;
// }

// function isInCurrentVisibleRange (top, height, scrollTop, clientHeight) {
// 	const bottom = top + height;
// 	const bottomBoundary = scrollTop + clientHeight;

// 	return (top <= scrollTop && bottom >= scrollTop) || //the bottom half of the page is on the screen
// 		(top <= bottomBoundary && bottom >= bottomBoundary) || //the top half of the page is on the screen
// 		(top >= scrollTop && top <= bottomBoundary); //the whole page is on the screen
// }

// function isInAfterVisibleRange (top, height, scrollTop, clientHeight) {
// 	const bottomBoundary = scrollTop + clientHeight;

// 	return top >= bottomBoundary && top <= bottomBoundary + clientHeight;
// }

function isInBeforeBuffer (top, height, scrollTop, clientHeight, buffer) {
	const bottom = top + height;
	const screenBottom = scrollTop + clientHeight;

	return bottom < screenBottom && bottom > scrollTop - (clientHeight * buffer);
}


function isInAfterBuffer (top, height, scrollTop, clientHeight, buffer) {
	return top > scrollTop && top < scrollTop + (clientHeight * (buffer + 2));
}


function isPossibleAnchor (top, height, scrollTop, clientHeight) {
	const bottom = top + height;
	const bottomBoundary = scrollTop + clientHeight;

	return top >= scrollTop && top <= bottomBoundary ||
		top <= scrollTop && bottom >= bottomBoundary;
}


export default  function updatePages (pageState, buffer, scrollingEl, getPageHeight) {
	const {pages} = pageState;
	const {scrollTop, clientHeight} = scrollingEl;

	let beforeBuffer = [];
	let anchorPage = null;
	let afterBuffer = [];

	let anchorOffset = 0;
	let anchorScreenOffset = 0;

	let distanceFromTop = 0;


	for (let page of pages) {
		const height = getPageHeight(page);

		const isAnchor = isPossibleAnchor(distanceFromTop, height, scrollTop, clientHeight);

		if (isAnchor && !anchorPage) {
			anchorPage = page;
			anchorOffset = distanceFromTop;
			anchorScreenOffset = distanceFromTop - scrollTop;
		} else if (isInAfterBuffer(distanceFromTop, height, scrollTop, clientHeight, buffer)) {
			afterBuffer.push(page);
		} else if (isInBeforeBuffer(distanceFromTop, height, scrollTop, clientHeight, buffer)) {
			beforeBuffer.push(page);
		}

		distanceFromTop += height;
	}

	return {
		pages,
		activePages: {
			before: beforeBuffer,
			after: afterBuffer,
			anchor: anchorPage,
			anchorOffset,
			anchorScreenOffset
		},
		totalHeight: distanceFromTop
	};
}
