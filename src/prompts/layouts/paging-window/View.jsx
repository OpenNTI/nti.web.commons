import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './View.css';
import Header from './header';

const cx = classnames.bind(Styles);

PromptLayoutPaging.propTypes = {
	className: PropTypes.string,
	children: PropTypes.any
};
export default function PromptLayoutPaging ({className, children, ...props}) {
	return (
		<section className={cx('paging-window', className)}>
			<Header {...props} />
			{children}
		</section>
	);
}