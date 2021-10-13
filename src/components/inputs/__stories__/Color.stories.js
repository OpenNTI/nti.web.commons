import { useState } from 'react';

import { Color } from '@nti/lib-commons';

import { Input } from '../../..';

const Presets = [
	{ color: Color.fromHex('#000000'), title: 'Black' },
	{ color: Color.fromHex('#ffffff'), title: 'White' },
	{ color: Color.fromHex('#d54e21'), title: 'Red' },
	{ color: Color.fromHex('#78a300'), title: 'Green' },
	{ color: Color.fromHex('#0e76a8'), title: 'Blue' },
	{ color: Color.fromHex('#9cc2cb'), title: 'Teal' },
];

export default {
	title: 'Components/inputs/Color',
	component: Input.Color,
};

export const Picker = () => {
	const [value, setValue] = useState();
	return <Input.Color value={value} onChange={setValue} />;
};

export const Flyout = () => {
	const [value, setValue] = useState(Color.fromHex('#3fb3f6'));

	return (
		<Input.Color.Flyout
			value={value}
			onChange={setValue}
			arrow
			verticalAlign={Input.Color.Flyout.ALIGNMENTS.BOTTOM}
			horizontalAlign={Input.Color.Flyout.ALIGNMENTS.LEFT}
		/>
	);
};

export const SaturationBrightness = () => {
	const [value, setValue] = useState();

	return (
		<Input.Color.SaturationBrightness value={value} onChange={setValue} />
	);
};
export const Hue = () => {
	const [value, setValue] = useState();

	return <Input.Color.Hue value={value} onChange={setValue} />;
};
export const Text = () => {
	const [value, setValue] = useState();

	return <Input.Color.Text value={value} onChange={setValue} />;
};

export const PresetSwatches = () => {
	const [value, setValue] = useState();

	return (
		<Input.Color.PresetSwatches
			swatches={Presets}
			selected={value}
			onSelect={setValue}
		/>
	);
};

export const AllTogether = () => {
	const [value, setValue] = useState();

	return (
		<>
			<Input.Color value={value} onChange={setValue} />

			<Input.Color.Flyout
				value={value}
				onChange={setValue}
				arrow
				verticalAlign={Input.Color.Flyout.ALIGNMENTS.BOTTOM}
				horizontalAlign={Input.Color.Flyout.ALIGNMENTS.LEFT}
			/>

			<div style={{ width: 300 }}>
				<Input.Color.SaturationBrightness
					value={value}
					onChange={setValue}
				/>
			</div>

			<Input.Color.Hue value={value} onChange={setValue} />
			<Input.Color.Text value={value} onChange={setValue} />
			<Input.Color.PresetSwatches
				swatches={Presets}
				selected={value}
				onSelect={setValue}
			/>
		</>
	);
};
