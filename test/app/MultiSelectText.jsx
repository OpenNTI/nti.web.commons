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
				<Input.MultiSelect onChange={this.onChange} values={values} placeholder={'None Selected...'}>
					{options.map((option) => <Input.MultiSelect.Option value={option} key={option}>{option}</Input.MultiSelect.Option>)}
				</Input.MultiSelect>
			</div>
		);
	}
}
