import React from 'react';
import {getServer} from '@nti/web-client';

import {Offline} from '../../../src';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

export default function OfflineTest () {
	return (
		<div>
			<Offline.Toasts />
			<button onClick={() => getServer().OnlineStatus.hadNetworkError()}>Trigger Network Error</button>
			<button onClick={() => getServer().OnlineStatus.hadNetworkSuccess()}>Trigger Network Success</button>
		</div>
	);
}