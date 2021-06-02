import React from 'react';
import classnames from 'classnames/bind';

import Text from '../../../text';

import Styles from './Header.css';

const cx = classnames.bind(Styles);

/**
 *
 * @param {Object} props
 * @param {string | JSX.Element} props.title
 * @param {Function} props.doClose
 * @returns {JSX.Element}
 */
export default function BaseWindowHeader({ title, doClose }) {
	return (
		<div className={cx('base-window-header')}>
			{title && (
				<Text.Base as="h1" className={cx('title')}>
					{title}
				</Text.Base>
			)}
			{doClose && (
				<a href="#" className={cx('dismiss')} onClick={doClose}>
					<i className="icon-light-x" />
				</a>
			)}
		</div>
	);
}
