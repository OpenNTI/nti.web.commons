import React from 'react';

import {Input} from '../../src';

export default class ColorInputTest extends React.Component {
	//presets to be fetched from server at some point..
	state = {
		value: null,
		presets: [
			{hex:'#000000', title:'Black'},
			{hex:'#ffffff',title:'White'},
			{hex:'#d54e21',title:'Red'},
			{hex:'#78a300',title:'Green'},
			{hex:'#0e76a8',title:'Blue'},
			{hex:'#9cc2cb',title:'Teal'},
			{hex:'#000000', title:'Black'},
			{hex:'#ffffff',title:'White'},
			{hex:'#d54e21',title:'Red'},
			{hex:'#78a300',title:'Green'},
			{hex:'#0e76a8',title:'Blue'},
			{hex:'#9cc2cb',title:'Teal'},
			{hex:'#0e76a8',title:'Blue'},
			{hex:'#9cc2cb',title:'Teal'},
			{hex:'#0e76a8',title:'Blue'},
			{hex:'#9cc2cb',title:'Teal'},
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
				<Input.Color.Presets presets={this.state.presets}  onChange={this.onChange}/>
			</div>
		);
	}
}
