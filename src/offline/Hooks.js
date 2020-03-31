import React from 'react';
import {getServer} from '@nti/web-client';

export function useOffline () {
	const server = React.useRef(getServer());
	const [offline, setOffline] = React.useState(false);

	React.useEffect(() => {
		return server.current.OnlineStatus.subscribeToChange(online => setOffline(!online));
	}, []);

	return offline;
}
