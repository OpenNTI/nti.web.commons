import React, {
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import * as Errors from '../errors';
import BasePrompt from '../standard-ui/prompt/Base';
import { useReducerState } from '../hooks/use-reducer-state';

import Styles from './Styles.css';
import FormContext from './Context';
import Input from './Input';
import SubmitButton from './SubmitButton';
import * as Validation from './validation';
import * as Values from './values';

const GlobalError = Symbol('Global Error');

function getChangeHandler({ form, addErrors, onChange, onValid, onInvalid }) {
	if (!onChange && !onValid && !onInvalid) {
		return null;
	}

	let wasValid = Validation.isValid(form.current);

	const callOnChange = async e => {
		if (!onChange) {
			return;
		}

		try {
			await onChange(Values.getValues(form.current), e);
		} catch (err) {
			if (!err.field) {
				addErrors({ [GlobalError]: err });
			} else {
				addErrors({ [err.field]: err });
			}
		}
	};

	return e => {
		const valid = Validation.isValid(form.current);

		callOnChange(e);

		if (valid === wasValid) {
			return;
		}

		wasValid = valid;

		if (valid && onValid) {
			onValid(e);
		}
		if (!valid && onInvalid) {
			onInvalid(e);
		}
	};
}

function getSubmitHandler({
	form,
	disabled,
	addErrors,
	onSubmit,
	afterSubmit,
	setSubmitting,
}) {
	if (!onSubmit) {
		return null;
	}

	return async e => {
		e.stopPropagation();
		e.preventDefault();

		if (disabled) {
			return;
		}

		const validationErrors = Validation.getValidationErrors(form.current);

		if (validationErrors) {
			addErrors(validationErrors);
			return;
		}

		try {
			setSubmitting(true);
			await onSubmit(Values.getValues(form.current), e);
			afterSubmit?.();
		} catch (err) {
			if (!err.field) {
				addErrors({ [GlobalError]: err });
			} else {
				addErrors({ [err.field]: err });
			}
		} finally {
			setSubmitting(false);
		}
	};
}

function getInitialErrorState(initialError) {
	return initialError
		? { [initialError.field || GlobalError]: initialError }
		: {};
}

Form.Validation = Validation;
Form.Values = Values;
Form.Input = Input;
Form.SubmitButton = SubmitButton;
Form.propTypes = {
	className: PropTypes.string,

	formRef: PropTypes.any,

	onSubmit: PropTypes.func,
	onChange: PropTypes.func,
	onValid: PropTypes.func,
	onInvalid: PropTypes.func,

	afterSubmit: PropTypes.func,

	disabled: PropTypes.bool,
	noValidate: PropTypes.bool,

	initialError: PropTypes.any,

	mask: PropTypes.any,

	children: PropTypes.any,
};
function Form(props) {
	const {
		className,

		formRef,

		onSubmit,
		onChange,
		onValid,
		onInvalid,

		afterSubmit,

		disabled,
		noValidate = true,

		initialError,

		mask,

		children,

		...otherProps
	} = props;

	const formEl = useRef(null);
	const [{ errors, submitting }, setState] = useReducerState({
		errors: getInitialErrorState(initialError),
		submitting: false,
	});

	const setErrors = useMemo(error => setState({ error }), []);
	const setSubmitting = useMemo(submitting => setState({ submitting }), []);

	useImperativeHandle(formRef, () => formEl.current);

	const addErrors = useCallback(
		toAdd => setErrors({ ...errors, ...toAdd }),
		[errors]
	);
	const clearError = useCallback(
		name => {
			if (errors && errors[name]) {
				setErrors({ ...errors, [name]: void 0, [GlobalError]: void 0 });
			} else if (errors[GlobalError]) {
				setErrors({ ...errors, [GlobalError]: void 0 });
			}
		},
		[errors]
	);

	const submitHandler = useMemo(
		() =>
			getSubmitHandler({
				form: formEl,
				disabled,
				addErrors,
				onSubmit,
				afterSubmit,
				setSubmitting,
			}),
		[formEl, disabled, addErrors, onSubmit, afterSubmit, setSubmitting]
	);

	const changeHandler = useMemo(
		() =>
			getChangeHandler({
				form: formEl,
				addErrors,
				onChange,
				onValid,
				onInvalid,
			}),
		[formEl, addErrors, onChange, onValid, onInvalid]
	);

	return (
		<FormContext.Provider
			value={{ errors, clearError, disabled, submitting }}
		>
			<form
				ref={formEl}
				className={cx(className, Styles.ntForm, {
					[Styles.disabled]: disabled,
					[Styles.submitting]: submitting,
					[Styles.hasMask]: Boolean(mask),
				})}
				noValidate={noValidate}
				onSubmit={submitHandler}
				onChange={changeHandler}
				{...otherProps}
			>
				{errors[GlobalError] && (
					<Errors.Message error={errors[GlobalError]} />
				)}
				{children}
				{submitting && mask && (
					<div className={Styles.formMask}>
						{mask !== true ? mask : null}
					</div>
				)}
			</form>
		</FormContext.Provider>
	);
}

const ForwardWrapper = (props, ref) => <Form {...props} formRef={ref} />;
const ForwardRef = React.forwardRef(ForwardWrapper);

const noop = () => {};

function FormPrompt(props) {
	return (
		<BasePrompt
			as={ForwardRef}
			onAction={noop}
			actionCmp={SubmitButton}
			{...props}
		/>
	);
}

ForwardRef.Validation = Validation;
ForwardRef.Values = Values;
ForwardRef.Input = Input;
ForwardRef.SubmitButton = SubmitButton;
ForwardRef.Prompt = FormPrompt;

export default ForwardRef;
