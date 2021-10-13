import { useEffect, useRef, useState } from 'react';

import { getServer } from '@nti/web-client';

let unloading = false;
const setUnloading = () => (unloading = true);

export function useOffline() {
	const server = useRef(getServer());
	const [offline, setOffline] = useState(false);

	useEffect(() => {
		window.addEventListener('beforeunload', setUnloading);

		return () => {
			window.removeEventListener('beforeunload', setUnloading);
		};
	}, []);

	useEffect(() => {
		return server.current.OnlineStatus.subscribeToChange(online => {
			if (!unloading) {
				setOffline(!online);
			}
		});
	}, []);

	return offline;
}
