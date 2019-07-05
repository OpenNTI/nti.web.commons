import React from 'react';
import classnames from 'classnames/bind';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

function TextVariant (...classNames) {
	return function wrapper (Cmp) {
		return function WithClass ({className, ...props}) {
			return (<Cmp className={cx(...classNames, className)} {...props} />);
		};
	};
}

export default {
	Base: TextVariant('nti-text')
};