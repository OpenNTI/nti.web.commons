import React from 'react';

import { useForceUpdate } from './use-force-update';

const ChangeEvent = 'change';
const addListener = (scope, event, fn) => {
	scope?.addListener?.(event, fn);

	return () => {
		scope?.removeListener?.(event, fn);
	};
};

export function useChanges(item, callback, eventName = ChangeEvent) {
	const forceUpdate = useForceUpdate();

	React.useEffect(() => {
		const handler = (...whatChanged) => {
			if (callback) {
				callback(forceUpdate, ...whatChanged);
			} else {
				forceUpdate();
			}
		};

		if (item) {
			return (
				item.subscribeToChange?.(handler) ??
				addListener(item, eventName, handler)
			);
		}
	}, [item, callback, eventName]);
}
