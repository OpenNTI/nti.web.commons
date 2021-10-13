import { useCallback, useMemo, useState } from 'react';

import { Select } from '../Select';

export const Basic = props => {
	const options = useMemo(() =>
		Array.from({ length: 5 }, (_, i) => `Option ${i + 1}`)
	);
	const [value, setValue] = useState(options[0]);

	return (
		<Select
			options={options}
			value={value}
			onChange={setValue}
			{...props}
		/>
	);
};

export const WithTitle = props => {
	const options = useMemo(() =>
		Array.from({ length: 5 }, (_, i) => `Option ${i + 1}`)
	);
	const [value, setValue] = useState(options[0]);

	return (
		<Select
			title={`Menu Title via prop (${value})`}
			options={options}
			value={value}
			onChange={setValue}
			{...props}
		/>
	);
};

export const WithStrings = props => {
	const options = useMemo(() =>
		Array.from({ length: 5 }, (_, i) => `Option ${i + 1}`)
	);

	const getText = useCallback(value => `You selected ${value}`);

	const [value, setValue] = useState(options[0]);

	return (
		<Select
			getText={getText}
			options={options}
			value={value}
			onChange={setValue}
			{...props}
		/>
	);
};

export const NoOptions = props => {
	return <Select value="No Options - Renders value as Text" {...props} />;
};

export default {
	title: 'Menu',
	component: Select,
	argTypes: {
		title: {
			control: { type: 'text' },
		},
	},
};
