import { useEffect, useRef } from 'react';

import { equals } from '@nti/lib-commons';
import { useForceUpdate } from '@nti/web-core';

const Initial = Symbol('initial');

useResolver.isPending = v => v instanceof Promise;
useResolver.isErrored = v => v instanceof Error;
useResolver.isResolved = v =>
	!useResolver.isPending(v) && !useResolver.isErrored(v);

export function useResolver(resolver, dependencyList = [], config = {}) {
	const { buffer } = config;

	if (!Array.isArray(dependencyList)) {
		throw new Error('Invalid dependency list argument. ');
	}

	const nonce = {};
	const prevDependencies = useRef();
	const bufferTimeout = useRef();
	const value = useRef(initialState(nonce));
	let discarded = false;

	const forceUpdate = useForceUpdate();
	const updateValue = v => {
		if (!discarded && nonce === value.current[Initial]) {
			value.current = v;
			forceUpdate();
		}
	};

	//If the dependency list changed immediately move to a pending state.
	if (
		prevDependencies.current &&
		!equals(prevDependencies.current, dependencyList)
	) {
		value.current = initialState(nonce);
		clearTimeout(bufferTimeout.current);
	}

	prevDependencies.current = dependencyList;

	useEffect(() => {
		const doResolve = async () => {
			if (!value.current || nonce !== value.current[Initial]) {
				updateValue(initialState(nonce));
			}

			try {
				value.current.resolve(resolver());

				const resolved = await value.current;

				updateValue(resolved);
			} catch (e) {
				const cause = e;
				let error = e;

				if (!(error instanceof Error)) {
					error = new Error(error);
					error.cause = cause;
				}

				updateValue(error);
			}
		};

		if (buffer != null) {
			bufferTimeout.current = setTimeout(doResolve, buffer);
		} else {
			doResolve();
		}

		return () => (discarded = true);
	}, dependencyList);

	return value.current;
}

function initialState(nonce) {
	let resolve;
	let reject;
	const p = new Promise((a, b) => ((resolve = a), (reject = b)));

	Object.assign(p, { resolve, reject, [Initial]: nonce });
	return p;
}
