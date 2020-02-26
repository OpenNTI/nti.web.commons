import React from 'react';
import PropTypes from 'prop-types';

import * as Errors from '../errors';

import FormContext from './Context';
import Input from './Input';
import SubmitButton from './SubmitButton';
import * as Validation from './validation';
import * as Values from './values';

const GlobalError = Symbol('Global Error');

function getChangeHandler (form, addErrors, onChange, onValid, onInvalid) {
	if (!onChange && !onValid && !onInvalid) { return null; }

	let wasValid = Validation.isValid(form.current);

	const callOnChange = async (e) => {
		if (!onChange) { return; }

		try {
			await onChange(Values.getValues(form.current), e);
		} catch (err) {
			if (!err.field) { addErrors({[GlobalError]: err}); }
			else { addErrors({[err.field]: err}); }
		}
	};

	return (e) => {
		const valid = Validation.isValid(form.current);

		callOnChange(e);

		if (valid === wasValid) { return; }

		wasValid = valid;

		if (valid && onValid) { onValid(e); }
		if (!valid && onInvalid) { onInvalid(e); }
	};
}

function getSubmitHandler (form, disabled, addErrors, onSubmit) {
	if (!onSubmit) { return null; }

	return async (e) => {
		e.stopPropagation();
		e.preventDefault();

		if (disabled) { return; }

		const validationErrors = Validation.getValidationErrors(form.current);

		if (validationErrors) {
			addErrors(validationErrors);
			return;
		}

		try {
			await onSubmit(Values.getValues(form.current), e);
		} catch (err) {
			if (!err.field) { addErrors({[GlobalError]: err}); }
			else { addErrors({[err.field]: err}); }
		}
	};
}

function getInitialErrorState (initialError) {
	return initialError ? {[initialError.field || GlobalError]: initialError} : {};
}

Form.Validation = Validation;
Form.Values = Values;
Form.Input = Input;
Form.SubmitButton = SubmitButton;
Form.propTypes = {
	onSubmit: PropTypes.func,
	onChange: PropTypes.func,
	onValid: PropTypes.func,
	onInvalid: PropTypes.func,

	disabled: PropTypes.bool,
	noValidate: PropTypes.bool,

	initialError: PropTypes.any,

	children: PropTypes.any
};
export default function Form (props) {
	const {
		onSubmit,
		onChange,
		onValid,
		onInvalid,

		disabled,
		noValidate = true,

		initialError,

		children,

		...otherProps
	} = props;

	const formEl = React.useRef(null);
	const [errors, setErrors] = React.useState(getInitialErrorState(initialError));

	const addErrors = (toAdd) => setErrors({...errors, ...toAdd});
	const clearError = (name) => {
		if (errors && errors[name]) {
			setErrors({...errors, [name]: void 0, [GlobalError]: void 0});
		} else if (errors[GlobalError]) {
			setErrors({...errors, [GlobalError]: void 0});
		}
	};

	return (
		<FormContext.Provider value={{errors, clearError, disabled}}>
			<form
				ref={formEl}
				noValidate={noValidate}
				onSubmit={getSubmitHandler(formEl, disabled, addErrors, onSubmit)}
				onChange={getChangeHandler(formEl, addErrors, onChange, onValid, onInvalid)}
				{...otherProps}
			>
				{errors[GlobalError] && (<Errors.Message error={errors[GlobalError]} />)}
				{children}
			</form>
		</FormContext.Provider>
	);
}