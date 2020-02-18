import React from 'react';

import {Form, Input} from '../../../src';


export default class FormTest extends React.Component {
	onSubmit = (values, e) => {
		const err = Error('Test Error');
		err.field = 'test';

		throw err;
	}

	render () {
		return (
			<div style={{padding: '2rem'}}>
				<Input.LabelPlaceholder style={Input.LabelPlaceholder.Underlined} label="Test">
					<Input.Text />
				</Input.LabelPlaceholder>

				<Input.LabelPlaceholder style={Input.LabelPlaceholder.Underlined} label="Test">
					<Input.Text />
				</Input.LabelPlaceholder>

				<Input.LabelPlaceholder style={Input.LabelPlaceholder.Underlined} label="Test">
					<Input.Text />
				</Input.LabelPlaceholder>

				<Input.LabelPlaceholder style={Input.LabelPlaceholder.Underlined} label="Test">
					<Input.Text />
				</Input.LabelPlaceholder>

				<Form onSubmit={this.onSubmit}>
					<Form.Input.Email name="test" label="Email" />
					<br />
					<button role="submit">Submit</button>
				</Form>
			</div>
		);
	}
}
