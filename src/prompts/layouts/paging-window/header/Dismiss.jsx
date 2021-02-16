import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

Dismiss.propTypes = {
	onDismiss: PropTypes.func,
	flat: PropTypes.bool,
};
export default function Dismiss({ onDismiss, flat }) {
	if (!onDismiss) {
		return null;
	}

	const icon = flat ? 'icon-bold-x' : 'icon-light-x';

	return (
		<a href="#" className={cx('dismiss')} onClick={onDismiss}>
			<i className={icon} />
		</a>
	);
}
