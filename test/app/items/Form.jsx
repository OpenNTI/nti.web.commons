import React from 'react';

import {Form} from '../../../src';


export default class FormTest extends React.Component {
	onSubmit = (values, e) => {
		const err = Error('Test Error');
		err.field = 'test';

		throw err;
	}

	render () {
		return (
			<div style={{padding: '2rem'}}>
				<Form onSubmit={this.onSubmit}>
					<Form.Input.Hidden name="hidden" value="value" />
					<Form.Input.Email name="email" label="Email" underlined />
					<Form.Input.Checkbox name="accept" label="Accept Terms" underlined />
					<Form.Input.Text name="test" locked center label="6-Digit Code"/>
					<button role="submit">Submit</button>
				</Form>
			</div>
		);
	}
}
