import React from 'react';

import {Input} from '../../../src';

export default function RangeInputTest () {
	const [value, setValue] = React.useState(0);

	return (
		<div style={{padding: '2rem'}}>
			<Input.Range value={value} onChange={setValue} />
		</div>
	);
}