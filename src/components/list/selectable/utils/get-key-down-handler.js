import {Events} from '@nti/lib-commons';

import {getSelectableItemIds} from './selectable-items';

const stop = e => (e.preventDefault(), e.stopPropagation());
const last = items => items[items.length - 1];
const first = items => items[0];

function moveFocusUp (e, items, {focused, setFocused}) {
	stop(e);

	const index = items.indexOf(focused);

	if (index <= 0) { setFocused(last(items)); }
	else { setFocused(items[index - 1]); }
}

function moveFocusDown (e, items, {focused, setFocused}) {
	stop(e);

	const index = items.indexOf(focused);

	if (index < 0) { setFocused(first(items)); }
	else if (index >= items.length - 1) { setFocused(first(items)); }
	else { setFocused(items[index + 1]); }	
}

function moveFocusToEnd (e, items, {focused, setFocused}) {
	stop(e);

	setFocused(last(items));
}

function moveFocusToStart (e, items, {focused, setFocused}) {
	stop(e);

	setFocused(first(items));
}

function handleEnter (e, items, {focused, setSelected}) {
	stop(e);

	if (focused) {
		setSelected(focused);
	}
}

const Handlers = {
	'nti-arrowdown': moveFocusDown,
	'nti-shift-arrowdown': moveFocusDown,

	'nti-arrowup': moveFocusUp,
	'nti-shift-arrowup': moveFocusUp,

	'nti-ctrl-arrowdown': moveFocusToEnd,
	'nti-alt-arrowdown': moveFocusToEnd,
	'nti-meta-arrowdown': moveFocusToEnd,

	'nti-ctrl-arrowup': moveFocusToStart,
	'nti-alt-arrowup': moveFocusToStart,
	'nti-meta-arrowup': moveFocusToStart,

	'nti-enter': handleEnter,
	'nti-shift-enter': handleEnter,
	'nti-ctrl-enter': handleEnter,
	'nti-alt-enter': handleEnter,
	'nti-meta-enter': handleEnter,
};

export default function getKeyDownHandler (listRef, state) {
	return (e) => {
		const keyCode = Events.getKeyCode(e);
		const handler = Handlers[keyCode];
		const items = getSelectableItemIds(listRef);

		if (handler && items) {
			handler(e, items, state);
		}
	};
}