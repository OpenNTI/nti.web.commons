import React from 'react';

useResolver.isPending = (v) => v instanceof Promise;
useResolver.isErrored = (v) => v instanceof Error;
useResolver.isResolved = (v) => !useResolver.isPending(v) && !useResolver.isErrored(v);
export default function useResolver (resolver, dependencyList) {
	const [value, setValue] = React.useState(undefined);
	let unmounted = false;

	const updateValue = (...args) => {
		if (!unmounted) {
			setValue(...args);
		}
	};

	React.useEffect(() => {
		const doResolve = async () => {
			try {
				const resolve = resolver();

				updateValue(resolve);

				const resolved = await resolve;

				updateValue(resolved);
			} catch (e) {
				updateValue(e);
			}
		};

		doResolve();

		return () => unmounted = true;
	}, dependencyList);

	return value;
}