import React from 'react';

import Tooltip from '../Tooltip';

export default {
	title: 'Components/Tooltip',
	component: Tooltip
};

export const StringLabel = () => (
	<Tooltip label="Test">
		<p>Bring your cursor here</p>
	</Tooltip>
);

export const MixedLabel = () => (
	<Tooltip label={<button>This is weird!</button>}>
		<p>Bring your cursor here</p>
	</Tooltip>
);
