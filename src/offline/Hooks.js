import React from 'react';

import { getServer } from '@nti/web-client';

let unloading = false;
const setUnloading = () => (unloading = true);

export function useOffline() {
	const server = React.useRef(getServer());
	const [offline, setOffline] = React.useState(false);

	React.useEffect(() => {
		window.addEventListener('beforeunload', setUnloading);

		return () => {
			window.removeEventListener('beforeunload', setUnloading);
		};
	}, []);

	React.useEffect(() => {
		return server.current.OnlineStatus.subscribeToChange(online => {
			if (!unloading) {
				setOffline(!online);
			}
		});
	}, []);

	return offline;
}
