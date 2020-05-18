import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from '../Styles.css';

const cx = classnames.bind(Styles);

PageContent.isContent = child => child.type === PageContent;
PageContent.propTypes = {
	className: PropTypes.string,
	as: PropTypes.any
};
export default function PageContent ({className, as:tag}) {
	const Cmp = tag || 'div';

	return (
		<Cmp className={cx('nt-page-content', className)}>
			Page Content
		</Cmp>
	);
}