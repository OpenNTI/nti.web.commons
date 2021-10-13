import { useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Styles from './Styles.css';
import FormContext from './Context';

FormSubmitButton.propType = {
	className: PropTypes.string,
};
export default function FormSubmitButton({ className, ...props }) {
	const formContext = useContext(FormContext);
	const { disabled } = formContext || {};

	const disabledProps = {};

	if (disabled) {
		disabledProps.disabled = true;
	}

	return (
		<button
			className={cx(className, Styles.submitButton)}
			type="submit"
			{...disabledProps}
			{...props}
		/>
	);
}
