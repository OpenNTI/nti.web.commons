import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default function ListHeader (props) {
	const {className} = props;

	return (
		<div className={cx('list-header-component', className)} {...props}/>
	);
}

ListHeader.propTypes = {
	className: PropTypes.string
};
