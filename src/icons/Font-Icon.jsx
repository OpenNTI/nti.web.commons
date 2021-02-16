import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Font-Icon.css';

const cx = classnames.bind(Styles);

FontIcon.propTypes = {
	className: PropTypes.string,
	icon: PropTypes.string,
};
export default function FontIcon({ className, icon, ...otherProps }) {
	return <i className={cx('font-icon', className, icon)} {...otherProps} />;
}
