export default function initPages (total, defaultHeight, scrollingEl) {
	const {scrollTop, clientHeight} = scrollingEl;
	const firstVisiblePage = Math.floor(scrollTop / defaultHeight);
	const buffer = Math.ceil(clientHeight / defaultHeight) * 3;

	const bufferRange = [firstVisiblePage - buffer , firstVisiblePage + (2 * buffer)];

	let pages = [];

	for (let i = 0; i < total; i++) {
		pages.push({
			key: `page-${i}`,
			index: i,
			minPageHeight: defaultHeight,
			visible: i >= bufferRange[0] && i <= bufferRange[1]
		});
	}


	return {pages, buffer};
}
