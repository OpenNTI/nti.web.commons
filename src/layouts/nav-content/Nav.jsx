import './Nav.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {StickyElement, FillToBottom} from '../../components';


NavContentNav.propTypes = {
	className: PropTypes.string,
	sticky: PropTypes.bool,
	fill: PropTypes.bool,
	children: PropTypes.any
};
export default function NavContentNav ({className, sticky, fill, children, ...otherProps}) {
	let content = children;

	if (fill) {
		content = (<FillToBottom limit>{content}</FillToBottom>);
	}

	if (sticky) {
		content = (<StickyElement topOffset={20}>{content}</StickyElement>);
	}

	return (
		<div className={cx('nav-content-nav', className)} {...otherProps}>
			{content}
		</div>
	);
}
