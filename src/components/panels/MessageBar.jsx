import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

MessageBar.propTypes = {
	message: PropTypes.string,
	error: PropTypes.bool
};

export default function MessageBar ({message, error}) {
	const cls = cx('panels-message-bar', {error});

	return (
		<div className={cls}>
			{message}
		</div>
	);
}
