import React from 'react';
import PropTypes from 'prop-types';

import FormContext from './Context';
import Input from './Input';
import * as Validation from './validation';

const GlobalError = Symbol('Global Error');

Form.Validation = Validation;
Form.Input = Input;
Form.propTypes = {
	className: PropTypes.string,

	onSubmit: PropTypes.func,
	onValid: PropTypes.func,
	onInvalid: PropTypes.func,

	disabled: PropTypes.bool,
	noValidate: PropTypes.bool,

	children: PropTypes.any
};
export default function Form ({className, onSubmit, onValid, onInvalid, disabled, noValidate = true, children, ...otherProps}) {
	const formEl = React.useRef(null);
	const [errors, setErrors] = React.useState({});

	const clearError = (name) => {
		if (errors && errors[name]) {
			setErrors({...errors, [name]: void 0, [GlobalError]: void 0});
		} else if (errors[GlobalError]) {
			setErrors({...errors, [GlobalError]: void 0});
		}
	};

	const handleChange = (onValid || onInvalid) ?
		(e) => {
			const wasValid = handleChange.isValid;
			const valid = Validation.isValid(formEl.current);

			if (valid === wasValid) { return; }

			handleChange.isValid = valid;

			if (valid && onValid) {
				onValid(e);
			} else if (onInvalid) {
				onInvalid(e);
			}
		} : null;

	const handleSubmit = onSubmit ?
		async (e) => {
			e.preventDefault();
			e.stopPropagation();

			if (disabled) { return; }
			
			const validationErrors = Validation.getValidationErrors(formEl.current);

			if (validationErrors) {
				setErrors(validationErrors);
				return;
			}
		} : null;

	return (
		<FormContext.Provider value={{errors, clearError, disabled}}>
			<form ref={formEl} noValidate={noValidate} onSubmit={handleSubmit} onChange={handleChange} {...otherProps}>
				{children}
			</form>
		</FormContext.Provider>
	);
}