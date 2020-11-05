import React from 'react';

const ALWAYS_NEW_VALUE = () => Date.now();

export default function useForceUpdate () {
	const [, update] = React.useReducer(ALWAYS_NEW_VALUE);
	return update;
}
