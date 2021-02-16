import React from 'react';
import PropTypes from 'prop-types';
import { ObjectUtils } from '@nti/lib-commons';

import * as Input from '../components/inputs';
import Checkbox from '../components/Checkbox';
import Radio from '../components/Radio';

import FormContext from './Context';

const ForceInputPropSet = new Set(['children']);

function WrapperFactory(Cmp, clearOn = 'onChange', labelOnInput) {
	FormInput.propTypes = {
		className: PropTypes.string,
		name: PropTypes.string.isRequired,
		label: PropTypes.string,
		inputRef: PropTypes.any,
		placeholder: PropTypes.string,
		underlined: PropTypes.bool,
		error: PropTypes.any,
	};
	function FormInput({
		className,
		name,
		label,
		inputRef,
		placeholder,
		underlined,
		error: errorProp,
		...otherProps
	}) {
		/*
			We need to be able to split out the props that go to the label placeholder and the ones that go to the input
			rather than duplicating the label placeholder's prop types we're checking the prop types to send the props
			it wants to the placeholder and the rest of them to the input.
		 */
		const { inputProps, labelProps } = Object.entries(otherProps).reduce(
			(acc, [key, value]) => {
				if (
					ObjectUtils.has(Input.LabelPlaceholder.propTypes, key) &&
					!ForceInputPropSet.has(key)
				) {
					acc.labelProps[key] = value;
				} else {
					acc.inputProps[key] = value;
				}

				return acc;
			},
			{ inputProps: {}, labelProps: {} }
		);

		const formContext = React.useContext(FormContext);
		const { errors = {}, clearError, submitting } = formContext || {};

		const clearProps = {};

		if (clearOn) {
			clearProps[clearOn] = (...args) => {
				if (otherProps[clearOn]) {
					otherProps[clearOn](...args);
				}
				if (clearError) {
					clearError(name);
				}
			};
		}

		return (
			<Input.LabelPlaceholder
				className={className}
				error={errorProp || errors[name]}
				variant={underlined ? 'underlined' : 'box'}
				label={labelOnInput ? null : label}
				{...labelProps}
			>
				<Cmp
					name={name}
					ref={inputRef}
					label={labelOnInput ? label : null}
					aria-label={label ?? placeholder}
					placeholder={placeholder}
					aria-invalid={Boolean(errors[name])}
					disabled={submitting}
					{...inputProps}
					{...clearProps}
				/>
			</Input.LabelPlaceholder>
		);
	}

	const RefWrapper = (props, ref) => <FormInput {...props} inputRef={ref} />;
	return React.forwardRef(RefWrapper);
}

const InputTypes = {
	wrap: WrapperFactory,
	Text: WrapperFactory(Input.Text),
	Email: WrapperFactory(Input.Email),
	Checkbox: WrapperFactory(Checkbox, 'onChange', true),
	Radio: WrapperFactory(Radio, 'onChange', true),
	Hidden: Input.Hidden,
};

export default InputTypes;
