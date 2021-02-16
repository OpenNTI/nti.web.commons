import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Text from '../../text';

import Styles from './MessageCard.css';
import Card from './Card';

const cx = classnames.bind(Styles);

ToastCardLayout.propTypes = {
	className: PropTypes.string,
	icon: PropTypes.node,
	title: PropTypes.string,
	style: PropTypes.string,
	message: PropTypes.string,
};
export default function ToastCardLayout({
	className,
	style,
	icon,
	title,
	message,
	...otherProps
}) {
	return (
		<Card
			className={cx('toast-message-card', className)}
			contentsClassName={cx('message-container', style)}
			style={style}
			{...otherProps}
		>
			{icon && <div className={cx('icon')}>{icon}</div>}
			<div className={cx('message')}>
				{title && (
					<Text.Base className={cx('title')}>{title}</Text.Base>
				)}
				{message && (
					<Text.Base className={cx('message')}>{message}</Text.Base>
				)}
			</div>
		</Card>
	);
}
