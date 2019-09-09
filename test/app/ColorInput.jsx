import React from 'react';

import {Input} from '../../src';

export default class ColorInputTest extends React.Component {
	state = {value: null}

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
				<Input.Text placeholder="hello" />
			</div>
		);
	}
}