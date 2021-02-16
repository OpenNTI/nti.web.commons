import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from '../Styles.css';

import Loading from './common/Loading';
import ErrorCmp from './common/Error';
import NotFound from './common/NotFound';

const cx = classnames.bind(Styles);

PageContent.Error = ErrorCmp;
PageContent.Loading = Loading;
PageContent.NotFound = NotFound;
PageContent.isContent = child => child.type === PageContent;
PageContent.propTypes = {
	className: PropTypes.string,
	as: PropTypes.any,
	children: PropTypes.any,
	card: PropTypes.bool,
};
export default function PageContent({
	className,
	as: tag,
	children,
	card = true,
}) {
	const Cmp = tag || 'div';

	return (
		<Cmp className={cx('nt-page-content', className, { card })}>
			{children}
		</Cmp>
	);
}
