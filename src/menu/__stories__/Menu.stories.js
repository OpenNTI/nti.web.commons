import React from 'react';

import { Menu } from '../Menu';

export const Basic = props => {
	const options = React.useMemo(() =>
		Array.from({ length: 5 }, (_, i) => `Option ${i + 1}`)
	);
	const [value, setValue] = React.useState(options[0]);

	return (
		<Menu options={options} value={value} onChange={setValue} {...props} />
	);
};

export const WithTitle = props => {
	const options = React.useMemo(() =>
		Array.from({ length: 5 }, (_, i) => `Option ${i + 1}`)
	);
	const [value, setValue] = React.useState(options[0]);

	return (
		<Menu
			title={`Menu Title via prop (${value})`}
			options={options}
			value={value}
			onChange={setValue}
			{...props}
		/>
	);
};

export const WithStrings = props => {
	const options = React.useMemo(() =>
		Array.from({ length: 5 }, (_, i) => `Option ${i + 1}`)
	);

	const getText = React.useCallback(value => `You selected ${value}`);

	const [value, setValue] = React.useState(options[0]);

	return (
		<Menu
			getText={getText}
			options={options}
			value={value}
			onChange={setValue}
			{...props}
		/>
	);
};

export const NoOptions = props => {
	return <Menu value="No Options - Renders value as Text" {...props} />;
};

export default {
	title: 'Menu',
	component: Menu,
	argTypes: {
		title: {
			control: { type: 'text' },
		},
	},
};
