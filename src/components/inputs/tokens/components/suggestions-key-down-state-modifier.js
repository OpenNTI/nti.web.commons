import {Events} from '@nti/lib-commons';


function moveDown (e, state) {
	const {focused, suggestions} = state;

	if (!suggestions) { return state; }

	let newFocused = null;

	for (let i = 0; i < suggestions.length; i++) {
		const suggestion = suggestions[i];

		if (!focused) {
			break;
		} else if (suggestion.isSameToken(focused)) {
			newFocused = suggestions[i + 1];
			break;
		}
	}

	return {
		...state,
		focused: newFocused || suggestions[0]
	};
}

function moveUp (e, state) {
	const {focused, suggestions} = state;

	if (!suggestions) { return state; }

	let newFocused = null;

	for (let i = 0; i < suggestions.length; i++) {
		const suggestion = suggestions[i];

		if (!focused) {
			break;
		} else if (suggestion.isSameToken(focused)) {
			newFocused = suggestions[i - 1];
		}
	}

	return {
		...state,
		focused: newFocused || suggestions[suggestions.length - 1]
	};
}

function moveToStart (e, state) {
	debugger;
}

function moveToEnd (e, state) {
	debugger;
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
};

export default function keyDownStateModifier (e, state) {
	const keyCode = Events.getKeyCode(e);
	const handler = HANDLERS[keyCode];

	return handler ? handler(e, state) : state;
}
