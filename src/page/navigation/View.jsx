import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from '../Styles.css';

const cx = classnames.bind(Styles);

PageNavigation.isNavigation = child => child.type === PageNavigation;
PageNavigation.propTypes = {
	className: PropTypes.string,
	as: PropTypes.any
};
export default function PageNavigation ({className, as: tag}) {
	const Cmp = tag || 'nav';

	return (
		<Cmp className={cx('nt-page-navigation', className)} >
			Page Navigation
		</Cmp>
	);
}