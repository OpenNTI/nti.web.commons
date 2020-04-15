import React from 'react';

import {Input} from '../../../src';

export default function InputsShowcase () {
	return (
		<div style={{padding: '2rem'}} >
			<Input.Currency onChange={(...args) => console.log('Currency Change: ', ...args)}/>
			<Input.Number />
		</div>
	);
}