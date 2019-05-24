import React from 'react';

import {Input} from '../../src';

const suggestions = [
	'red',
	'green',
	'blue',
	'orange',
	'yellow',
	'brown'
];

const placeholder = {
	empty: 'Please add a token',
	withTokens: 'Add another token'
};

export default class Test extends React.Component {
	state = {value: ['red']}

	onChange = (value) => {
		this.setState({value});
	}


	getSuggestions = (match) => {
		if (!match) { return suggestions; }

		return suggestions.filter(x => x.indexOf(match) !== -1);
	}

	render () {
		const {value} = this.state;

		return (
			<div style={{padding: '1rem', width: '350px'}}>
				<Input.Tokens
					light
					onChange={this.onChange}
					value={value}
					placeholder={placeholder}
					getSuggestions={this.getSuggestions}
				/>
			</div>
		);
	}
}
