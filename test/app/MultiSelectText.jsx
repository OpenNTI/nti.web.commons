import React from 'react';

import {Input} from '../../src';

const options = Array.from({length: 100}, (_, index) => index);

export default class Test extends React.Component {
	state = {values: []}

	onChange = (values) => {
		this.setState({values});
	}

	render () {
		const {values} = this.state;

		return (
			<div>
				<Input.Select.Multiple onChange={this.onChange} values={values} multiple>
					{options.map((option) => <Input.Select.Option value={option} key={option}>{option}</Input.Select.Option>)}
				</Input.Select.Multiple>
			</div>
		);
	}
}
