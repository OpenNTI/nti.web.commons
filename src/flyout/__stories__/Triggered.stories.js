import React from 'react';

import Triggered from '../Triggered';

export default {
	title: 'Flyout/Triggered',
	component: Triggered
};

export const Base = () => (
	<Triggered
		trigger={<button>Open Flyout</button>}
	>
		<p>
			Flyout Content
		</p>
	</Triggered>
);


export const KeyboardNavigation = () => (
	<div>
		<input />
		<br />
		<br />
		<Triggered trigger={<button>Open Flyout</button>}>
			<label>
				<div>Flyout Input</div>
				<input />
			</label>
		</Triggered>
		<br />
		<br />
		<input />
	</div>
);

export const PreventDismiss = () => {
	const [block, setBlock] = React.useState(false);

	return (
		<div>
			<label>
				<input type="checkbox" checked={block} onChange={(e) => setBlock(e.target.checked)} />
				<span>Block Dismiss</span>
			</label>
			<br />
			<Triggered trigger={<button>Open Flyout</button>} beforeDismiss={() => !block}>
				<p>
					Flyout Content
				</p>
			</Triggered>
		</div>
	);
};
