import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Input, Checkbox} from '../components';

import FormContext from './Context';
import Styles from './Input.css';

const cx = classnames.bind(Styles);

function WrapperFactory (Cmp, clearOn = 'onChange', labelOnInput) {
	FormInput.propTypes = {
		className: PropTypes.string,
		name: PropTypes.string.isRequired,
		label: PropTypes.string,
		inputRef: PropTypes.any,
		placeholder: PropTypes.string
	};
	function FormInput ({className, name, label, inputRef, placeholder, ...otherProps}) {
		const formContext = React.useContext(FormContext);
		const {errors = {}, clearError} = formContext || {};

		const clearProps = {};

		if (clearOn) {
			clearProps[clearOn] = (...args) => {
				if (otherProps[clearOn]) { otherProps[clearOn](...args); }
				if (clearError) { clearError(name); }
			};
		}

		return (
			<Input.Label className={cx(className, 'form-input-label')} error={errors[name]} label={labelOnInput ? null : label}>
				<Cmp name={name} ref={inputRef} label={labelOnInput ? label : null} aria-label={label ?? placeholder} placeholder={placeholder} aria-invalid={Boolean(errors[name])} {...otherProps} {...clearProps} />
			</Input.Label>
		);
	}

	const RefWrapper = (props, ref) => (<FormInput {...props} inputRef={ref} />);
	return React.forwardRef(RefWrapper);
}

const InputTypes = {
	wrap: WrapperFactory,
	Text: WrapperFactory(Input.Text),
	Email: WrapperFactory(Input.Email),
	Checkbox: WrapperFactory(Checkbox, 'onChange', true)
};

export default InputTypes;
