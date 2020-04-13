import {SelectableItemProp} from '../Constants';

export function getSelectableItems (listRef) {
	if (!listRef || !listRef.current) { return null; }

	return Array.from(
		listRef.current.querySelectorAll(`[${SelectableItemProp}]`)
	);
}

export function getSelectableItemIds (listRef) {
	const items = getSelectableItems(listRef);

	if (!items) { return items; }
 
	return items.map(item => item.getAttribute(SelectableItemProp));
}