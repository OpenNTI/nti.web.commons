import updatePageState from './update-page-state';

export default function initPages (total, defaultHeight, buffer, scrollingEl) {
	let pages = [];

	for (let i = 0; i < total; i++) {
		pages.push({
			key: `page-${i}`,
			index: i,
			pageHeight: defaultHeight,
			visible: false
		});
	}

	return updatePageState({
		pages,
		visiblePages: [],
		visibleOffset: 0,
		totalHeight: total * defaultHeight
	}, buffer, scrollingEl);
}
