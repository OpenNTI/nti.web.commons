import { getScrollParent, canScroll } from '@nti/lib-dom';

import { getSelectableItemForId } from './selectable-items';

export default function scrollFocusedIntoView(listRef, focused) {
	const cmp = getSelectableItemForId(listRef, focused);
	const list = listRef.current;

	if (!cmp) {
		return;
	}

	const scroller = canScroll(list) ? list : getScrollParent(list);

	const scrollRect = scroller.getBoundingClientRect();
	const optionRect = cmp.getBoundingClientRect();

	const listHeight = scroller.clientHeight;
	const top = optionRect.top - scrollRect.top;
	const bottom = top + optionRect.height;

	let newTop = scroller.scrollTop;

	if (bottom > listHeight) {
		newTop = bottom - listHeight + newTop;
	} else if (top < 0) {
		newTop = newTop + top;
	}

	scroller.scrollTop = newTop;
}
