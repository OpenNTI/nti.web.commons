import React from 'react';

import {Form} from '../../../src';


export default class FormTest extends React.Component {
	onValid = () => {
		debugger;	
	};

	onInvalid = () => {
		debugger;
	};

	render () {
		return (
			<Form onValid={this.onValid} onInvalid={this.onInvalid} >
				<Form.Input.Email name="test" />
				<button role="submit">Submit</button>
			</Form>
		);
	}
}