import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';


NavContentNav.propTypes = {
	className: PropTypes.string
};
export default function NavContentNav ({className, ...otherProps}) {
	return (
		<div className={cx('nav-content-nav', className)} {...otherProps} />
	);
}
