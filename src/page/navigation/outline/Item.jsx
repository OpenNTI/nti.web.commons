import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Text from '../../../text';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

NavigationOutlineItem.activeClassName = cx('active-outline-item');
NavigationOutlineItem.propTypes = {
	className: PropTypes.string,

	as: PropTypes.any
};
export default function NavigationOutlineItem ({className, as: tag, ...otherProps}) {
	const Cmp = tag || 'a';

	return (
		<Cmp className={cx('outline-item', className, Text.Classes.Base)} {...otherProps} />
	);
}