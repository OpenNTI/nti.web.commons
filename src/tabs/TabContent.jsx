import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './Tab.css';

const cx = classnames.bind(styles);

export default function TabContent ({children, active}) {
	return !active ? null : (
		<div className={cx('nti-tab-content')}>{children}</div>
	);
}

TabContent.propTypes = {
	active: PropTypes.bool,
};
