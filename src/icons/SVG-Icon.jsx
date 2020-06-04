import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './SVG-Icon.css';

const cx = classnames.bind(Styles);

SVGIcon.propTypes = {
	className: PropTypes.string,
	viewBox: PropTypes.string
};
export default function SVGIcon ({className, viewBox = '0 0 16 16', ...otherProps}) {
	return (
		<svg
			className={cx('svg-icon', className)}
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox={viewBox}
			{...otherProps}
		/>
	);
}