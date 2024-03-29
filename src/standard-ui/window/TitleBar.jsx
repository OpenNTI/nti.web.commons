import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Icons } from '@nti/web-core';

import Styles from './TitleBar.css';

const cx = classnames.bind(Styles);

TitleBar.propTypes = {
	className: PropTypes.string,
	closeLink: PropTypes.any,
	onClose: PropTypes.func,
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};
export default function TitleBar({ className, closeLink, onClose, title }) {
	const closeIcon = (
		<Icons.X className={cx('close-icon')} onClick={onClose} />
	);

	return (
		<div className={cx('nt-title-bar', className)}>
			{closeLink
				? React.cloneElement(closeLink, {}, closeIcon)
				: closeIcon}
			<div className={cx('title-container')}>{title}</div>
		</div>
	);
}
