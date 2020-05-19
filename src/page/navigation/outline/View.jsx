import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';
import Header from './Header';
import Item from './Item';

const cx = classnames.bind(Styles);

NavigationOutline.Header = Header;
NavigationOutline.Item = Item;
NavigationOutline.propTypes = {
	className: PropTypes.string,
	as: PropTypes.any,
	children: PropTypes.any
};
export default function NavigationOutline ({className, as:tag, children}) {
	const Cmp = tag || 'div';

	return (
		<Cmp className={cx('navigation-outline', className)}>
			{children}
		</Cmp>
	);
}