import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

ToastWrapper.propTypes = {
	className: PropTypes.string,
	toast: PropTypes.shape({
		id: PropTypes.string
	})
};
export default function ToastWrapper ({className, toast}) {
	return (
		<li className={cx('toast-wrapper', className)}>
			{toast.id}
		</li>
	);
}