import './ListHeader.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

ListHeader.propTypes = {
	className: PropTypes.string,
};

export default function ListHeader({ className, ...props }) {
	return (
		<div className={cx('list-header-component', className)} {...props} />
	);
}
