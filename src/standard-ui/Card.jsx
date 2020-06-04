import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Card.css';
import Component from './Component';

const cx = classnames.bind(Styles);

NTCard.propTypes = {
	className: PropTypes.string,
	rounded: PropTypes.bool
};
export default function NTCard ({className, rounded, ...otherProps}) {
	return (
		<Component {...otherProps} className={cx('nt-card', className, {rounded})} />
	);
}
