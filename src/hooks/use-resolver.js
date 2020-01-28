import React from 'react';

const Initial = Symbol();

useResolver.isPending = (v) => v instanceof Promise;
useResolver.isErrored = (v) => v instanceof Error;
useResolver.isResolved = (v) => !useResolver.isPending(v) && !useResolver.isErrored(v);

export default function useResolver (resolver, dependencyList) {
	const [value, setValue] = React.useState(initialState);
	let unmounted = false;

	const updateValue = (v) => {
		if (!unmounted) {
			setValue(v);
		}
	};

	React.useEffect(() => {
		const doResolve = async () => {
			let localValue = value;

			if (!value || !value[Initial]) {
				localValue = initialState();
				updateValue(localValue);
			}

			try {
				localValue.resolve(resolver());
				
				const resolved = await localValue;

				updateValue(resolved);
			} catch (e) {
				let error = e;
				const cause = e;

				if (!(error instanceof Error)) {
					error = new Error(error);
					error.cause = cause;
				}

				updateValue(error);
			}
		};

		doResolve();

		return () => unmounted = true;
	}, dependencyList);

	return value;
}


function initialState () {
	let resolve;
	let reject;
	const p = new Promise((a,b) => (resolve = a, reject = b));

	Object.assign(p, {resolve, reject, [Initial]: true});
	return p;
}