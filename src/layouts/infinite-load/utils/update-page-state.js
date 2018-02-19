import isPossibleAnchor from './is-possible-anchor';
import getAnchor from './get-anchor-from-page-state';
import getAfterAnchor from './get-after-anchor';
import getBeforeAnchor from './get-before-anchor';

function moveAnchorUp (pageState, buffer, scrollingEl, getPageHeight) {
	const {scrollTop, clientHeight} = scrollingEl;
	const {anchorPage, anchorOffset} = getAnchor(pageState);

	let possibleAnchor = anchorPage;

	let distanceFromOffset = -getPageHeight(possibleAnchor);

	while (possibleAnchor > 0) {
		const height = getPageHeight(possibleAnchor);

		distanceFromOffset += height;

		if (!isPossibleAnchor(anchorOffset - distanceFromOffset, height, scrollTop, clientHeight)) {
			break;
		}

		possibleAnchor -= 1;
	}

	return {
		anchorPage: possibleAnchor,
		anchorOffset: anchorOffset - distanceFromOffset
	};
}

function moveAnchorDown (pageState, buffer, scrollingEl, getPageHeight) {
	const {scrollTop, clientHeight} = scrollingEl;
	const {anchorPage, anchorOffset} = getAnchor(pageState);

	let distanceFromOffset = 0;
	let possibleAnchor = anchorPage;

	while (possibleAnchor < pageState.total) {
		const height = getPageHeight(possibleAnchor);

		if (isPossibleAnchor(distanceFromOffset + anchorOffset, height, scrollTop, clientHeight)) {
			break;
		}
		distanceFromOffset += height;
		possibleAnchor += 1;
	}

	return {
		anchorPage: possibleAnchor,
		anchorOffset: anchorOffset + distanceFromOffset
	};
}


function moveAnchor (scrollTop, oldScrollTop, pageState, buffer, scrollingEl, getPageHeight) {
	return scrollTop < oldScrollTop ? moveAnchorUp(pageState, buffer, scrollingEl, getPageHeight) : moveAnchorDown(pageState, buffer, scrollingEl, getPageHeight);
}


export default function updatePageState (pageState, buffer, scrollingEl, getPageHeight) {
	const {scrollTop} = scrollingEl;
	const {scrollTop:oldScrollTop} = pageState;

	if (scrollTop === oldScrollTop) { return pageState; }

	const anchor = moveAnchor(scrollTop, oldScrollTop, pageState, buffer, scrollingEl, getPageHeight);
	const {after, afterHeight} = getAfterAnchor(anchor, pageState, buffer, scrollingEl, getPageHeight);
	const {before, beforeHeight} = getBeforeAnchor(anchor, pageState, buffer, scrollingEl, getPageHeight);

	return {
		activePages: {
			before,
			beforeHeight,
			after,
			afterHeight,
			anchorOffset: anchor.anchorOffset
		},
		scrollTop,
		total: pageState.total,
		totalHeight: beforeHeight + afterHeight
	};
}
