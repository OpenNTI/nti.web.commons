import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import styles from './Tab.css';

const cx = classnames.bind(styles);

export default function Tab({ label, active, className }) {
	return <div className={cx('nti-tab', { active }, className)}>{label}</div>;
}

Tab.propTypes = {
	label: PropTypes.node,
	active: PropTypes.bool,
};
