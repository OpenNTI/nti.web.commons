import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

ErrorListItem.propTypes = {
	error: PropTypes.object.isRequired,
	isWarning: PropTypes.bool,
	onErrorFocus: PropTypes.func
};

function ErrorListItem ({error, isWarning, onErrorFocus}) {
	const {attachedTo, message} = error;
	const {label} = attachedTo;
	const cls = cx('nti-error-list-item', {warning: isWarning});

	const onClick = () => {
		if (error && error.focus) {
			error.focus();

			if (onErrorFocus) {
				onErrorFocus();
			}
		}
	};

	return (
		<div className={cls}>
			{label && (<span className="label" onClick={onClick}>{label}</span>)}
			<span className="message">{message}</span>
		</div>
	);
}

export default ErrorListItem;
