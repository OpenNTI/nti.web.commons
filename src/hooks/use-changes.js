import React from 'react';

import useForceUpdate from './use-force-update';

const ChangeEvent = 'change';
const addListener = (scope, event, fn) => {
	scope.addListener(event, fn);

	return () => {
		scope.removeListener(event, fn);
	};
};

export default function useChanges (item, callback, eventName = ChangeEvent) {
	const forceUpdate = useForceUpdate();

	React.useEffect(() => {
		const handler = () => {
			if (callback) { callback(); }
			else { forceUpdate(); }
		};

		return  item.subscribeToChange ?
			item.subscribeToChange(handler) :
			addListener(item, eventName);
	}, [item, callback]);
}