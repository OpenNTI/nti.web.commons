import getAnchor from './get-anchor-from-page-state';
import getBeforeAnchor from './get-before-anchor';
import getAfterAnchor from './get-after-anchor';

export default function fixPageState (pageState, buffer, scrollingEl, getPageHeight) {
	const {activePages} = pageState;
	const {beforeHeight:oldBeforeHeight} = activePages || {};
	const {scrollTop:oldScrollTop} = scrollingEl;

	const anchor = getAnchor(pageState);
	const {before, beforeHeight} = getBeforeAnchor(anchor, pageState, buffer, scrollingEl, getPageHeight);
	const {after, afterHeight} = getAfterAnchor(anchor, pageState, buffer, scrollingEl, getPageHeight);

	const topDiff = beforeHeight - oldBeforeHeight;

	return {
		activePages: {
			before,
			beforeHeight,
			after,
			afterHeight,
			anchorOffset: anchor.anchorOffset + topDiff
		},
		scrollTop: oldScrollTop + topDiff,
		total: pageState.total,
		totalHeight: beforeHeight + afterHeight
	};
}
