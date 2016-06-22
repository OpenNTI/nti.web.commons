import React from 'react';
import cx from 'classnames';

export default function ListHeader (props) {
	const {className} = props;

	return (
		<div className={cx('list-header-component', className)} {...props}/>
	);
}

ListHeader.propTypes = {
	className: React.PropTypes.string
};
