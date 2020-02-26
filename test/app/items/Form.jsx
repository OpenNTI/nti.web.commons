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
					<br/>
					<Form.Input.Text name="test" required locked center noError fill label="LCNF Box"/>
					<Form.Input.Text name="test" required locked center noError fill underlined label="LCNF Underline"/>
					<Form.Input.Text name="test" required locked center noError label="LCN Box"/>
					<Form.Input.Text name="test" required locked center noError underlined label="LCN Underline"/>
					<Form.Input.Text name="test" required locked center fill label="LCF Box"/>
					<Form.Input.Text name="test" required locked center fill underlined label="LCF Underline"/>
					<Form.Input.Text name="test" required locked center label="LC Box"/>
					<Form.Input.Text name="test" required locked center underlined label="LC Underline"/>
					<Form.Input.Text name="test" required locked noError fill label="LNF Box"/>
					<Form.Input.Text name="test" required locked noError fill underlined label="LNF Underline"/>
					<Form.Input.Text name="test" required locked noError label="LN Box"/>
					<Form.Input.Text name="test" required locked noError underlined label="LN Underline"/>
					<Form.Input.Text name="test" required locked fill label="LF Box"/>
					<Form.Input.Text name="test" required locked fill underlined label="LF Underline"/>
					<Form.Input.Text name="test" required locked label="L Box"/>
					<Form.Input.Text name="test" required locked underlined label="L Underline"/>

					<Form.Input.Text name="test" required center noError fill label="CNF Box"/>
					<Form.Input.Text name="test" required center noError fill underlined label="CNF Underline"/>
					<Form.Input.Text name="test" required center noError label="CN Box"/>
					<Form.Input.Text name="test" required center noError underlined label="CN Underline"/>
					<Form.Input.Text name="test" required center fill label="CF Box"/>
					<Form.Input.Text name="test" required center fill underlined label="CF Underline"/>
					<Form.Input.Text name="test" required center label="C Box"/>
					<Form.Input.Text name="test" required center underlined label="C Underline"/>
					<Form.Input.Text name="test" required noError fill label="NF Box"/>
					<Form.Input.Text name="test" required noError fill underlined label="NF Underline"/>
					<Form.Input.Text name="test" required noError label="N Box"/>
					<Form.Input.Text name="test" required noError underlined label="N Underline"/>
					<Form.Input.Text name="test" required fill label="F Box"/>
					<Form.Input.Text name="test" required fill underlined label="F Underline"/>
					<Form.Input.Text name="test" required label="Box"/>
					<Form.Input.Text name="test" required underlined label="Underline"/>

					<button role="submit">Submit</button>
				</Form>
			</div>
		);
	}
}
