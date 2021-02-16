import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Thumb.css';

const cx = classnames.bind(Styles);

ColorInputThumb.propTypes = {
	className: PropTypes.string,
	value: PropTypes.shape({
		hex: PropTypes.shape({
			toString: PropTypes.func,
		}),
	}),
	style: PropTypes.object,
};
export default function ColorInputThumb({
	className,
	value,
	style,
	...otherProps
}) {
	return (
		<div
			className={cx(
				'nti-color-input-thumb',
				'color-input-thumb',
				className
			)}
			style={{
				...style,
				...(value ? { background: value.hex.toString() } : {}),
			}}
			{...otherProps}
		/>
	);
}
