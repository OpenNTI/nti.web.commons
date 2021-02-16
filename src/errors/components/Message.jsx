import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Text from '../../text';
import { getMessage, isWarning } from '../messages';

import Styles from './Message.css';

const cx = classnames.bind(Styles);

ErrorMessage.propTypes = {
	className: PropTypes.string,

	error: PropTypes.any,
	label: PropTypes.string,

	textRef: PropTypes.any,
};
export default function ErrorMessage({
	className,
	error,
	label,
	textRef,
	...otherProps
}) {
	const empty = !error;

	return (
		<Text.Base
			className={cx('nti-error-message', className, {
				empty,
				warning: isWarning(error),
			})}
			aria-hidden={empty ? 'true' : 'false'}
			{...otherProps}
		>
			{label && <span className={cx('label')}>{label}</span>}
			{error && getMessage(error)}
		</Text.Base>
	);
}
