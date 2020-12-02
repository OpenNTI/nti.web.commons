import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Card.css';
import Component from './Component';

const cx = classnames.bind(Styles);

const NTCard = React.forwardRef(({className, rounded, ...otherProps}, ref) => {
	return (
		<Component {...otherProps} className={cx('nt-card', className, {rounded})} ref={ref} />
	);
});

NTCard.displayName = 'NTCard';
NTCard.propTypes = {
	className: PropTypes.string,
	rounded: PropTypes.bool
};

export default NTCard;
