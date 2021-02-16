import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './View.css';
import Header from './Header';
import Footer from './Footer';

const cx = classnames.bind(Styles);

BaseWindowLayout.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any,
};
export default function BaseWindowLayout({
	className,
	children,
	...otherProps
}) {
	return (
		<div className={cx('base-window-layout', className)}>
			<Header {...otherProps} />
			<div className={cx('window-body')}>{children}</div>
			<Footer {...otherProps} />
		</div>
	);
}
