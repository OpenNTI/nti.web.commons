// import isInBeforeBuffer from './is-in-before-buffer';
// import isInAfterBuffer from './is-in-after-buffer';
// import isPossibleAnchor from './is-possible-anchor.js';

import updatePageState from './update-page-state';

export default function initPages (total, buffer, scrollingEl, getPageHeight) {
	return updatePageState({
		activePages: {
			anchorOffset: 0
		},
		scrollTop: -1,
		total,
	}, buffer, scrollingEl, getPageHeight);

	// let before = [];
	// let after = [];
	// let anchorOffset = 0;

	// let distanceFromTop = 0;

	// for (let i = 0; i < total; i++) {
	// 	const height = getPageHeight(i);

	// 	const isAnchor = isPossibleAnchor(distanceFromTop, height, scrollTop, clientHeight, buffer);
	// 	const isAfter = isInAfterBuffer(distanceFromTop, height, scrollTop, clientHeight, buffer);
	// 	const isBefore = isInBeforeBuffer(distanceFromTop, height, scrollTop, clientHeight, buffer);

	// 	if (isAnchor && !after.length) {
	// 		after.push(i);
	// 		anchorOffset = distanceFromTop;
	// 	} else if (isAfter) {
	// 		after.push(i);
	// 	} else if (isBefore) {
	// 		before.push(i);
	// 	}

	// 	distanceFromTop += height;
	// }

	// return {
	// 	activePages: {
	// 		before,
	// 		after,
	// 		anchorOffset
	// 	},
	// 	scrollTop,
	// 	total,
	// 	totalHeight: distanceFromTop
	// };
}
