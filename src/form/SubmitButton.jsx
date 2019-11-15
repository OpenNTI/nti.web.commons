import React from 'react';

import FormContext from './Context';

export default function FormSubmitButton (props) {
	const formContext = React.useContext(FormContext);
	const {disabled} = formContext || {};

	const disabledProps = {};

	if (disabled) {
		disabledProps.disabled = true;
	}

	return (
		<button
			type="submit"
			{...disabledProps}
			{...props}
		/>
	);
}