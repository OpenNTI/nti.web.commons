import React from 'react';

import Toast from '../toast';

import {useOffline} from './Hooks';

export default function OfflineToasts () {
	const offline = useOffline();

	if (!offline) { return null; }

	return (
		<Toast.MessageCard
			location={Toast.Locations.TopRight}
			title="Network Connection Issues"
			message="We are having trouble connecting to our servers. Please check your network connection."
		/>
	);
}