import {Events} from '@nti/lib-commons';

const DEFAULT = 'default';
const stop = e => { e.preventDefault(); e.stopPropagation(); };

function isFocusAtStart (e) {
	return e.target.selectionStart === 0;
}

function selectPreviousToken (e, state) {
	stop(e);
	const {focused, tokens} = state;


	if (!focused) {
		return {...state, focused: tokens[tokens.length - 1]};
	}

	let prev = null;

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		if (token.isSameToken(focused)) {
			prev = tokens[i - 1];
			break;
		}
	}

	return {
		...state,
		focused: prev || tokens[0]
	};
}

function selectNextToken (e, state) {
	stop(e);
	const {focused, tokens} = state;


	let next = null;

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		if (token.isSameToken(focused)) {
			next = tokens[i + 1];
			break;
		}
	}

	return {
		...state,
		focused: next || null
	};
}

function deleteSelectedToken (e, state) {
	const {focused, tokens} = state;

	if (!focused) { return state; }

	stop(e);

	let prevToken = null;
	let newTokens = [];

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		if (token.isSameToken(focused)) {
			prevToken = tokens[i - 1];
		} else {
			newTokens.push(token);
		}
	}

	return {
		...state,
		focused: prevToken || newTokens[0],
		tokens: newTokens
	};
}

const HANDLERS = {
	'nti-backspace': (e, state) => (
		state.focused ?
			deleteSelectedToken(e, state) :
			isFocusAtStart(e) ? selectPreviousToken(e, state) : state
	),

	'nti-arrowleft': (e, state) => (
		state.focused || isFocusAtStart(e) ? selectPreviousToken(e, state) : state
	),

	'nti-arrowright': (e, state) => (
		isFocusAtStart(e) && state.focused ? selectNextToken(e, state) : state
	),

	[DEFAULT]: (e, state) => ({...state, focused: null})
};

export default function inputKeyDownStateModifier (e, state) {
	const keyCode = Events.getKeyCode(e);
	const handler = HANDLERS[keyCode] || HANDLERS[DEFAULT];

	return handler ? handler(e, state) : state;
}
