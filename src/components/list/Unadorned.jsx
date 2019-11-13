import React from 'react';
import classnames from 'classnames/bind';

import styles from './Unadorned.css';

const cx = classnames.bind(styles);

export default function UnadornedList ({className, ...props}) {
	return (
		<ul className={cx('unadorned-list', className)} {...props} />
	);
}
