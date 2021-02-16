import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default function TabContent({ children, active }) {
	return !active ? null : (
		<div className={cx('nti-tab-content')}>{children}</div>
	);
}

TabContent.propTypes = {
	active: PropTypes.bool,
};
