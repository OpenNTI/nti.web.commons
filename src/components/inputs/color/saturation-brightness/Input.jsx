import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Color} from '@nti/lib-commons';

import Styles from './Input.css';
import Controls from './Controls';

const cx = classnames.bind(Styles);

SaturationBrightnessInput.propTypes = {
	className: PropTypes.string,
	value: PropTypes.shape({
		hsl: PropTypes.shape({
			hue: PropTypes.number,
			toString: PropTypes.func,
			setSaturation: PropTypes.func,
			setLightness: PropTypes.func
		})
	})
};
export default function SaturationBrightnessInput (props) {
	const {className, value} = props;
	const style = {
		background: value ? Color.fromHSL(value.hsl.hue, 1, 0.5).hsl.toString() : Color.fromHSL(0, 1, 0.5).hsl.toString()
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