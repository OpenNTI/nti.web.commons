export default function getAfterAnchor (anchor, pageState, buffer, scrollingEl, getPageHeight) {
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
