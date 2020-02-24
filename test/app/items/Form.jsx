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
					<Form.Input.Email name="test" label="Email" underlined/>
					<Form.Input.Checkbox name="accept" label="Accept Terms" underlined />
					<button role="submit">Submit</button>
				</Form>
			</div>
		);
	}
}
