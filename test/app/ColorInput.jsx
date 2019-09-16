import React from 'react';

import {Input} from '../../src';

export default class ColorInputTest extends React.Component {
	//presets to be fetched from server at some point..
	state = {
		value: null,
		presets: [
			{color:'#000000', title:'Black'},
			{color:'#ffffff',title:'White'},
			{color:'#d54e21',title:'Red'},
			{color:'#78a300',title:'Green'},
			{color:'#0e76a8',title:'Blue'},
			{color:'#9cc2cb',title:'Teal'},
			{color:'#000000', title:'Black'},
			{color:'#ffffff',title:'White'},
			{color:'#d54e21',title:'Red'},
			{color:'#78a300',title:'Green'},
			{color:'#0e76a8',title:'Blue'},
			{color:'#9cc2cb',title:'Teal'},
			{color:'#0e76a8',title:'Blue'},
			{color:'#9cc2cb',title:'Teal'},
			{color:'#0e76a8',title:'Blue'},
			{color:'#9cc2cb',title:'Teal'},
		]
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
				<Input.Text placeholder="hello" />
				<Input.Color.Presets presets={this.state.presets}  onChange={this.onChange}/>
			</div>
		);
	}
}
