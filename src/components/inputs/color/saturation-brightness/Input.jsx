import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Input.css';
import Controls from './Controls';

const cx = classnames.bind(Styles);

SaturationBrightnessInput.propTypes = {
	className: PropTypes.string,
	value: PropTypes.shape({
		hsl: PropTypes.shape({
			toString: PropTypes.func
		})
	})
};
export default function SaturationBrightnessInput (props) {
	const {className, value} = props;
	const style = {
		background: value ? value.hsl.toString() : ''
	};

	return (
		<div className={cx('saturation-brightness-input', className)} >
			<div className={cx('background')} style={style} />
			<div className={cx('saturation-layer')} />
			<div className={cx('brightness-layer')} />
			<Controls {...props} />
		</div>
	);
}