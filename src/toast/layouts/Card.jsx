import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Styles as Types } from '../Constants';

import Styles from './Card.css';

const cx = classnames.bind(Styles);

ToastCardLayout.propTypes = {
	className: PropTypes.string,
	contentsClassName: PropTypes.string,
	style: PropTypes.oneOf(Object.values(Types)),
	children: PropTypes.any,
	onDismiss: PropTypes.func,
};
export default function ToastCardLayout({
	className,
	style,
	children,
	onDismiss,
	contentsClassName,
	...otherProps
}) {
	return (
		<div className={cx('toast-card', className, style)} {...otherProps}>
			{onDismiss && (
				<div className={cx('header')}>
					<i className="icon-bold-x" onClick={onDismiss} />
				</div>
			)}
			<div className={cx('contents', contentsClassName)}>{children}</div>
		</div>
	);
}
