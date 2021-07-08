import { useReducer, useCallback } from 'react';

/** @typedef {(state: any) => void} dispatch */
/** @typedef {() => void} reset */

/**
 * @template T
 * @param {T} initial
 * @returns {[T, dispatch, reset ]}
 */
export function useReducerState(initial) {
	const [state, dispatch] = useReducer((s, a) => ({ ...s, ...a }), initial);
	const reset = useCallback(() => dispatch(initial), [dispatch]);
	return [state, dispatch, reset];
}
