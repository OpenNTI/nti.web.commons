import {Events} from 'nti-commons';

const stop = e => { e.preventDefault(); e.stopPropagation(); };

function maybeOpen (e, state) {
	const {isOpen} = state;

	if (!isOpen) {
		return {...state, isOpen: true};
	}
}

function moveDown (e, state) {
	stop(e);
	const {activeOptions, focusedIndex} = state;
	const open = maybeOpen(e, state);

	if (open) {
		return open;
	}

	let newFocusedIndex = focusedIndex + 1;

	return {
		...state,
		focusedIndex: newFocusedIndex <= activeOptions.length - 1 ?	newFocusedIndex : 0
	};
}

function moveUp (e, state) {
	stop(e);
	const {activeOptions, focusedIndex} = state;
	const open = maybeOpen(e, state);

	if (open) {
		return open;
	}

	let newFocusedIndex = focusedIndex - 1;

	return {
		...state,
		focusedIndex: newFocusedIndex >= 0 ? newFocusedIndex : activeOptions.length - 1
	};
}

function moveToEnd (e, state) {
	stop(e);
	const {activeOptions} = state;
	const open = maybeOpen(e, state);

	if (open) {
		return open;
	}

	return {
		...state,
		focusedIndex: activeOptions.length - 1
	};
}

function moveToStart (e, state) {
	stop(e);
	const open = maybeOpen(e, state);

	if (open) {
		return open;
	}

	return {
		...state,
		focusedIndex: 0
	};
}


function handleEnter (e, state) {
	stop(e);
	const {focusedIndex} = state;

	return {
		...state,
		isOpen: false,
		selectedIndex: focusedIndex
	};
}


function handleEscape (e, state) {
	stop(e);
	const {selectedIndex} = state;

	return {
		...state,
		isOpen: false,
		focusedIndex: selectedIndex
	};
}


const HANDLERS = {
	'nti-arrowdown': moveDown,
	'nti-shift-arrowdown': moveDown,

	'nti-arrowup': moveUp,
	'nti-shift-arrowup': moveUp,

	'nti-ctrl-arrowdown': moveToEnd,
	'nti-alt-arrowdown': moveToEnd,
	'nti-meta-arrowdown': moveToEnd,

	'nti-ctrl-arrowup': moveToStart,
	'nti-alt-arrowup': moveToStart,
	'nti-meta-arrowup': moveToStart,

	'nti-enter': handleEnter,
	'nti-shift-enter': handleEnter,
	'nti-ctrl-enter': handleEnter,
	'nti-alt-enter': handleEnter,
	'nti-meta-enter': handleEnter,

	'nti-escape': handleEscape,
	'nti-shift-escape': handleEscape,
	'nti-ctrl-escape': handleEscape,
	'nti-alt-escape': handleEscape,
	'nti-meta-escape': handleEscape
};

export default function keyDownStateModifier (e, state) {
	const keyCode = Events.getKeyCode(e);
	const handler = HANDLERS[keyCode];

	return handler ? handler(e, state) : state;
}
