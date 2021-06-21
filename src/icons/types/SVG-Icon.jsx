import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const SVG = styled('svg')`
	display: inline-block;
`;

SVGIcon.propTypes = {
	className: PropTypes.string,
	viewBox: PropTypes.string,
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
export default function SVGIcon({
	className,
	viewBox = '0 0 16 16',
	width = '1em',
	...otherProps
}) {
	return (
		<SVG
			className={cx('svg-icon', 'nt-icon', className)}
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			viewBox={viewBox}
			fill="currentColor"
			{...otherProps}
		/>
	);
}
