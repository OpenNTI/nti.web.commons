import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);


Dismiss.propTypes = {
	onDismiss: PropTypes.func
};
export default function Dismiss ({onDismiss}) {
	if (!onDismiss) { return null;}

	return (
		<a href="#" className={cx('dismiss')} onClick={onDismiss}>
			<i className="icon-light-x" />
		</a>
	);
}