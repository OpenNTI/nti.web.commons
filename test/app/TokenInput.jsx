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

export default class Test extends React.Component {
	state = {values: []}

	onChange = (values) => {
		this.setState({values});
	}


	getSuggestions = (match) => {
		if (!match) { return suggestions; }

		return suggestions.filter(x => x.indexOf(match) !== -1);
	}

	render () {
		const {values} = this.state;

		return (
			<div>
				<Input.Tokens
					onChange={this.onChange}
					values={values}
					placeholder={'None Selected...'}
					getSuggestions={this.getSuggestions}
				/>
			</div>
		);
	}
}
