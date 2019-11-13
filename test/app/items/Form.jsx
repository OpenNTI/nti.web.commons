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
			<Form onSubmit={this.onSubmit}>
				<Form.Input.Email name="test" />
				<button role="submit">Submit</button>
			</Form>
		);
	}
}