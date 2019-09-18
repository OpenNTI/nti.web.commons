import React from 'react';
import {Color} from '@nti/lib-commons';

import {Input} from '../../src';

const Presets = [
	{color: Color.fromHex('#000000'), title: 'Black'},
	{color: Color.fromHex('#ffffff'), title: 'White'},
	{color: Color.fromHex('#d54e21'), title: 'Red'},
	{color: Color.fromHex('#78a300'), title: 'Green'},
	{color: Color.fromHex('#0e76a8'), title: 'Blue'},
	{color: Color.fromHex('#9cc2cb'), title: 'Teal'}
];

export default class ColorInputTest extends React.Component {
	//presets to be fetched from server at some point..
	state = {
		value: null
	}

	onChange = (value) => {
		console.log(value.hex.toString());//eslint-disable-line
		this.setState({value});
	}

	render () {
		const {value} = this.state;

		return (
			<div>
				<Input.Color value={value} onChange={this.onChange} />
				<Input.Color.SaturationBrightness value={value} onChange={this.onChange} />
				<Input.Color.Hue value={value} onChange={this.onChange} />
				<Input.Color.Text value={value} onChange={this.onChange} />
				<Input.Color.PresetSwatches swatches={Presets} selected={value} onSelect={this.onChange}/>
			</div>
		);
	}
}
