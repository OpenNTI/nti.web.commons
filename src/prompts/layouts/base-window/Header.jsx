import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Text from '../../../text';

import Styles from './Header.css';

const cx = classnames.bind(Styles);

BaseWindowHeader.propTypes = {
	title: PropTypes.string,
	doClose: PropTypes.func,
};
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
