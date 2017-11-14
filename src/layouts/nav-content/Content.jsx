import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

NavContentContent.propTypes = {
	className: PropTypes.string
};
export default function NavContentContent ({className, ...otherProps}) {
	return (
		<div className={cx('nav-content-content', className)} {...otherProps} />
	);
}
