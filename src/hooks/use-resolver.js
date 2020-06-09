import React from 'react';
import {equals} from '@nti/lib-commons';

import useForceUpdate from './use-force-update';

const Initial = Symbol();

useResolver.isPending = (v) => v instanceof Promise;
useResolver.isErrored = (v) => v instanceof Error;
useResolver.isResolved = (v) => !useResolver.isPending(v) && !useResolver.isErrored(v);

export default function useResolver (resolver, dependencyList, config = {}) {
	const {buffer} = config;

	const prevDependencies = React.useRef();
	const bufferTimeout = React.useRef();
	const value = React.useRef(initialState());
	let unmounted = false;

	const forceUpdate = useForceUpdate();
	const updateValue = (v) => {
		if (!unmounted) {
			value.current = v;
			forceUpdate();
		}
	};

	//If the dependency list changed immediately move to a pending state.
	if (prevDependencies.current && !equals(prevDependencies.current, dependencyList)) {
		value.current = initialState();
		clearTimeout(bufferTimeout.current);
	}

	prevDependencies.current = dependencyList;

	React.useEffect(() => {
		const doResolve = async () => {
			if (!value || !value[Initial]) {
				updateValue(initialState());
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

		return () => unmounted = true;
	}, dependencyList);


	return value.current;
}


function initialState () {
	let resolve;
	let reject;
	const p = new Promise((a,b) => (resolve = a, reject = b));

	Object.assign(p, {resolve, reject, [Initial]: true});
	return p;
}