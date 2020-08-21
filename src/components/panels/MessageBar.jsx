import './MessageBar.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

MessageBar.propTypes = {
	message: PropTypes.string,
	error: PropTypes.bool,
	iconCls: PropTypes.string
};

export default function MessageBar ({message, error, iconCls}) {
	const cls = cx('panels-message-bar', {error});

	return (
		<div className={cls}>
			{iconCls && (<i className={iconCls} />)}
			{message}
		</div>
	);
}
