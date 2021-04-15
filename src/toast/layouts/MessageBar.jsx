import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Text from '../../text';

import Styles from './MessageBar.css';

const cx = classnames.bind(Styles);

ToastMessage.propTypes = {
	className: PropTypes.string,
	error: PropTypes.bool,

	icon: PropTypes.node,

	title: PropTypes.string,
	message: PropTypes.string,

	onDismiss: PropTypes.func,
};
export default function ToastMessage({ className, error, icon, title, message, onDismiss }) {
	return (
		<div className={cx('toast-message-bar', className, {error})} onClick={onDismiss}>
			{icon && (<div className={cx('icon-container')}>{icon}</div>)}
			<div className={cx('message-container')}>
				{title && (
					<Text.Base className={cx('title')}>{title}</Text.Base>
				)}
				{message && (
					<Text.Base className={cx('message')}>{message}</Text.Base>
				)}
			</div>
			{onDismiss && <i className={cx('icon-bold-x', 'close-icon')} />}
		</div>
	);
}
