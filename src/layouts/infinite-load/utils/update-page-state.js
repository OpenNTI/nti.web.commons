import isPossibleAnchor from './is-possible-anchor';

function getAnchor (pageState) {
	const {activePages} = pageState;
	const {after, anchorOffset} = activePages || {};

	return {
		anchorPage: after ? after[0] : 0,
		anchorOffset: anchorOffset || 0
	};
}

function moveAnchorUp (pageState, buffer, scrollingEl, getPageHeight) {
	const {scrollTop, clientHeight} = scrollingEl;
	const {anchorPage, anchorOffset} = getAnchor(pageState);

	let possibleAnchor = anchorPage;

	let distanceFromOffset = -getPageHeight(possibleAnchor);

	while (possibleAnchor >= 0) {
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


function getBeforeAnchor (anchor, pageState, buffer, scrollingEl, getPageHeight) {
	const {clientHeight} = scrollingEl;
	const {anchorPage} = anchor;
	const beforeBufferSize = clientHeight * buffer;

	let before = [];

	let beforeHeight = 0;
	let beforeIndex = anchorPage - 1;

	while (beforeIndex >= 0) {
		const height = getPageHeight(beforeIndex);

		if (beforeHeight < beforeBufferSize) {
			before.push(beforeIndex);
		}

		beforeHeight += height;
		beforeIndex -= 1;
	}

	return {
		before: before.reverse(),
		beforeHeight
	};
}


function getAfterAnchor (anchor, pageState, buffer, scrollingEl, getPageHeight) {
	const {clientHeight} = scrollingEl;
	const {anchorPage} = anchor;
	const afterBufferSize = clientHeight * (buffer + 1);

	let after = [anchorPage];

	let afterHeight = getPageHeight(anchorPage);
	let afterIndex = anchorPage + 1;

	while (afterIndex < pageState.total) {
		const height = getPageHeight(afterIndex);

		if (afterHeight < afterBufferSize) {
			after.push(afterIndex);
		}

		afterHeight += height;
		afterIndex += 1;
	}

	return {
		after,
		afterHeight
	};
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
			after,
			anchorOffset: anchor.anchorOffset
		},
		scrollTop,
		total: pageState.total,
		totalHeight: beforeHeight + afterHeight
	};
}
