import React from 'react';
import cx from 'classnames';

ErrorListItem.propTypes = {
	error: React.PropTypes.object.isRequired,
	isWarning: React.PropTypes.bool
};

function ErrorListItem ({error, isWarning}) {
	const {attachedTo, message} = error;
	const {label} = attachedTo;
	const cls = cx('nti-error-listitem', {warning: isWarning});

	return (
		<div className={cls}>
			{label && (<span className="label">label</span>)}
			<span className="message">{message}</span>
		</div>
	);
}

export default ErrorListItem;
