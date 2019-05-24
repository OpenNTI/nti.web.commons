import {Events} from '@nti/lib-commons';

const stop = e => { e.preventDefault(); e.stopPropagation(); };

function isFocusAtStart (e) {
	if (!global.getSelection) { return false; }

	const selection = global.getSelection();
	const range = selection && selection.getRangeAt(0);

	if (!range) { return false; }

	const {target} = e;
	const {startContainer, startOffset} = range;

	return startOffset === 0 && (startContainer.contains(target) || startContainer.isSameNode(target));
}

function selectPreviousToken (e, state) {
	const {selected, tokens} = state;

	stop(e);

	if (!selected) {
		return {...state, selected: tokens[tokens.length - 1]};
	}

	let prev = null;

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		if (token.isSameToken(selected)) {
			prev = tokens[i - 1];
			break;
		}
	}

	return {
		...state,
		selected: prev || tokens[0]
	};
}

function selectNextToken (e, state) {
	const {selected, tokens} = state;

	let next = null;

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		if (token.isSameToken(selected)) {
			next = tokens[i + 1];
			break;
		}
	}

	return {
		...state,
		selected: next || null
	};
}

function deleteSelectedToken (e, state) {
	const {selected, tokens} = state;

	if (!selected) { return state; }

	stop(e);

	let prevToken = null;
	let newTokens = [];

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		if (token.isSameToken(selected)) {
			prevToken = tokens[i - 1];
		} else {
			newTokens.push(token);
		}
	}

	return {
		...state,
		selected: prevToken || newTokens[0],
		tokens: newTokens
	};
}

const HANDLERS = {
	'nti-backspace': (e, state) => (
		state.selected ?
			deleteSelectedToken(e, state) :
			state.inputValue === '' ? selectPreviousToken(e, state) : state
	),

	'nti-arrowleft': (e, state) => (
		state.selected || isFocusAtStart(e) ? selectPreviousToken(e, state) : state
	),

	'nti-arrowright': (e, state) => (
		isFocusAtStart(e) && state.selected ? selectNextToken(e, state) : state
	)
};

export default function inputKeyDownStateModifier (e, state) {
	const keyCode = Events.getKeyCode(e);
	const handler = HANDLERS[keyCode];

	return handler ? handler(e, state) : state;
}
