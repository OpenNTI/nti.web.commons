import React from 'react';

import {Input} from '../../../src';


const suggestions = [
	'red',
	'green',
	'blue',
	'orange',
	'yellow',
	'brown',
	'red-orange'
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
		return new Promise((fulfill) => {
			setTimeout(() => {
				if (!match) { return fulfill(suggestions); }

				return fulfill(suggestions.filter(x => x.indexOf(match) !== -1));
			}, 1000);
		});

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
					allowNewTokens={Input.Tokens.ALLOW_EXPLICIT}
					suggestionsLabel="Suggestions"
				/>
			</div>
		);
	}
}
