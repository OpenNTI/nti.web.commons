import {Events} from '@nti/lib-commons';

import getValueForOption from './get-value-for-option';

const stop = e => {
	e.preventDefault();
	e.stopPropagation();
};

function getMoveDownIndex (options, focusedIndex) {
	return Math.min((focusedIndex || 0) + 1, options.length - 1);
}

function moveDown (e, state) {
	stop(e);

	const {activeOptions, focusedIndex} = state;

	return {
		...state,
		focusedIndex: getMoveDownIndex(activeOptions, focusedIndex)
	};
}


function moveUp (e, state) {
	stop(e);

	const {focusedIndex} = state;

	return {
		...state,
		focusedIndex: Math.max((focusedIndex || 0) - 1, 0)
	};
}


function handleEnter (e, state) {
	stop(e);

	const {activeOptions, focusedIndex, selectedOptions} = state;
	const focusedOption = activeOptions[focusedIndex];
	const focusedValue = getValueForOption(focusedOption);

	const selectedSet = new Set(selectedOptions.map(option => getValueForOption(option)));
	let newSelected = [...selectedOptions];

	if (selectedSet.has(focusedValue)) {
		newSelected = newSelected.filter(option => getValueForOption(option) !== focusedValue);
	} else {
		newSelected.push(focusedOption);
	}

	return {
		...state,
		selectedOptions: newSelected
	};
}


const HANDLERS = {
	'nti-arrowdown': moveDown,

	'nti-arrowup': moveUp,

	'nti-enter': handleEnter,
};

export default function multipleKeyDownStateModifier (e, state) {
	const keyCode = Events.getKeyCode(e);
	const handler = HANDLERS[keyCode];

	return handler ? handler(e, state) : state;
}
