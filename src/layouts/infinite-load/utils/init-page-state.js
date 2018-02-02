import updatePageState from './update-page-state';

export default function initPages (total, buffer, scrollingEl, getPageHeight) {
	let pages = [];

	for (let i = 0; i < total; i++) {
		pages.push({
			key: `page-${i}`,
			index: i,
			visible: false
		});
	}

	return updatePageState({
		pages,
		visiblePages: [],
	}, buffer, scrollingEl, getPageHeight);
}
