import React from 'react';

import Tooltip from '../Tooltip';

export default {
	title: 'Components/Tooltip',
	component: Tooltip,
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

export const VerticalColumn = () => (
	<div
		className={css`
			display: flex;
			flex-direction: column;
		`}
	>
		{Array.from({ length: 10 }).map((_, i) => (
			<Tooltip key={i} label={<button>This is weird!</button>}>
				<p>Bring your cursor here</p>
			</Tooltip>
		))}
	</div>
);
