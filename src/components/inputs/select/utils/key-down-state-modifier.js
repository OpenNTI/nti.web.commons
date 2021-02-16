import { Events } from '@nti/lib-commons';

const stop = e => {
	e.preventDefault();
	e.stopPropagation();
};

function maybeOpen(e, state) {
	const { isOpen } = state;

	if (!isOpen) {
		return { ...state, isOpen: true };
	}
}

function moveDown(e, state) {
	stop(e);
	const { activeOptions, focusedIndex } = state;
	const open = maybeOpen(e, state);

	if (open) {
		return open;
	}

	return {
		...state,
		focusedIndex: Math.min(focusedIndex + 1, activeOptions.length - 1),
	};
}

function moveUp(e, state) {
	stop(e);
	const { focusedIndex } = state;
	const open = maybeOpen(e, state);

	if (open) {
		return open;
	}

	return {
		...state,
		focusedIndex: Math.max(focusedIndex - 1, 0),
	};
}

function moveToEnd(e, state) {
	stop(e);
	const { activeOptions } = state;
	const open = maybeOpen(e, state);

	if (open) {
		return open;
	}

	return {
		...state,
		focusedIndex: activeOptions.length - 1,
	};
}

function moveToStart(e, state) {
	stop(e);
	const open = maybeOpen(e, state);

	if (open) {
		return open;
	}

	return {
		...state,
		focusedIndex: 0,
	};
}

function handleEnter(e, state) {
	stop(e);
	const { focusedIndex, activeOptions } = state;

	return {
		...state,
		isOpen: false,
		selectedOption: activeOptions[focusedIndex],
	};
}

function handleEscape(e, state) {
	stop(e);
	const { selectedIndex } = state;

	return {
		...state,
		isOpen: false,
		focusedIndex: selectedIndex,
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
	'nti-meta-escape': handleEscape,
};

export default function keyDownStateModifier(e, state) {
	const keyCode = Events.getKeyCode(e);
	const handler = HANDLERS[keyCode];

	return handler ? handler(e, state) : state;
}
