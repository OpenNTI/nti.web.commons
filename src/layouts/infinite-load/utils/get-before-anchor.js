export default function getBeforeAnchor(
	anchor,
	pageState,
	buffer,
	scrollingEl,
	getPageHeight
) {
	const { clientHeight } = scrollingEl;
	const { anchorPage } = anchor;
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
		beforeHeight,
	};
}
