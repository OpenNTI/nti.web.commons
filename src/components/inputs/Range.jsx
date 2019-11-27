import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Range.css';

const cx = classnames.bind(Styles);

const ThumbWidth = 16;

const getPercentageForValue = (value, min, max) => {
	const range = max - min;
	const relativeValue = value - min;

	return Math.round((relativeValue / range) * 100);
};

const getThumbStyle = (value, min, max) => {
	const percentage = getPercentageForValue(value, min, max);

	return {
		left: `calc(${percentage }% - ${ThumbWidth * (percentage / 100)}px)`
	};
};

const getBarStyle = (value, min, max) => {
	const percentage = getPercentageForValue(value, min, max);

	const left = 'var(--primary-blue)';
	const right = 'var(--border-grey-light)';

	return {
		background: `linear-gradient(to right, ${left}, ${left} ${percentage}%, ${right} ${percentage}%, ${right} 100%)`
	};
};

const coerce = value => isNaN(value) ? null : parseFloat(value, 10);

RangeInput.propTypes = {
	className: PropTypes.string,
	value: PropTypes.number,
	min: PropTypes.number,
	max: PropTypes.number,
	onChange: PropTypes.func
};
export default function RangeInput ({className, value, min = 0, max = 100, onChange: onChangeProp, ...otherProps}) {
	const onChange = (e) => {
		onChangeProp(coerce(e.target.value), e);
	};

	return (
		<label className={cx('nti-range-input', className)}>
			<div className={cx('bar')} style={getBarStyle(value, min, max)} />
			<span className={cx('thumb')} data-value={value} style={getThumbStyle(value, min, max)} />
			<input {...otherProps} type="range" onChange={onChange} value={value} min={min} max={max} />
		</label>
	);
}