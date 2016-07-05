import React from 'react';
import cx from 'classnames';

ErrorListItem.propTypes = {
	error: React.PropTypes.object.isRequired,
	isWarning: React.PropTypes.bool
};

function ErrorListItem ({error, isWarning}) {
	const {attachedTo, message} = error;
	const {label} = attachedTo;
	const cls = cx('nti-error-list-item', {warning: isWarning});

	const onClick = () => {
		if (error && error.focus) {
			error.focus();
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
