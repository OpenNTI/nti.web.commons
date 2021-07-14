import { useReducer, useCallback, useRef } from 'react';

/** @typedef {(state: any) => void} dispatch */
/** @typedef {() => void} reset */
/**
 * A factory that produces a setter. ex:
 *
 *     const setTitle = getSetter('title');
 *     <input onChange={setTitle} value={title} />
 *
 * where the setter is defined as:
 *
 * 		setTitle:= (x => setState({title: x}))
 *
 * The returned setter is stable for the life of the component.
 *
 * @typedef {(...keys: string[]) => (...values: any[]) => void} getSetter
 */

/**
 * @template T
 * @param {T} initial
 * @returns {[T, dispatch, reset, getSetter ]}
 */
export function useReducerState(initial) {
	const [state, dispatch] = useReducer((s, a) => ({ ...s, ...a }), initial);
	const reset = useCallback(() => dispatch(initial), [dispatch]);

	// setter cache
	const { current: setters } = useRef({});
	/** @type {getSetter} */
	const getSetterFactory = useCallback(
		(...key) =>
			// use the joined key string as cache key
			setters[key.join()] ||
			// build setter if the above results in nothing...
			(setters[key.join()] = (...x) =>
				dispatch(
					// build object mapping key1: x1, key2: x2, etc...
					key.reduce(
						(result, currentKey, currentIndex) => ({
							...result,
							[currentKey]: x[currentIndex],
						}),
						// starting object
						{}
					)
				)),
		[]
	);

	return [state, dispatch, reset, getSetterFactory];
}
