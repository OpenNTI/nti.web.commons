import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Color, restProps} from '@nti/lib-commons';
import {scoped} from '@nti/lib-locale';

import NumberInput from '../../Number';
import Label from '../../Label';

import Styles from './HSL.css';

const cx = classnames.bind(Styles);
const t = scoped('common.inputs.color.text.RGB', {
	hue: 'H',
	saturation: 'S',
	lightness: 'L'
});

export default class NTIRGBInput extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.shape({
			hsl: PropTypes.shape({
				hue: PropTypes.string,
				saturation: PropTypes.string,
				lightness: PropTypes.string,
				setHue: PropTypes.func,
				setSaturation: PropTypes.func,
				setLightness: PropTypes.func
			})
		}),

		onChange: PropTypes.func
	}


	onHueChange = (hue, e) => {
		const {onChange, value} = this.props;
		const newValue = value ?
			Color.fromHSL(hue, value.hsl.saturation, value.hsl.lightness) :
			Color.fromHSL(hue, 1, 0.5);

		if (onChange) {
			onChange(newValue, e);
		}
	}

	onSaturationChange = (sat, e) => {
		const {onChange, value} = this.props;
		const newValue = value ?
			Color.fromHSL(value.hsl.hue, sat, value.hsl.lightness) :
			Color.fromHSL(0, sat / 100, 0.5);

		if (onChange) {
			onChange(newValue, e);
		}
	}

	onLightnessChange = (light, e) => {
		const {onChange, value} = this.props;
		const newValue = value ?
			Color.fromHSL(value.hsl.hue, value.hsl.saturation, light) :
			Color.fromRGB(0, 0, light / 100);

		if (onChange) {
			onChange(newValue, e);
		}
	}


	render () {
		const {value, className} = this.props;
		const otherProps = restProps(NTIRGBInput, this.props);
		const hue = value ? value.hsl.hue : 0;
		const saturation = value ? value.hsl.saturation : 0;
		const lightness = value ? value.hsl.lightness : 0;

		return (
			<div className={cx('nti-hsl-input', className)} {...otherProps}>
				<Label className={cx('nti-hsl-label')} label={t('hue')}>
					{this.renderInput(hue, this.onHueChange, t('hue'), 0, 360, 1)}
				</Label>
				<Label className={cx('nti-hsl-label')} label={t('saturation')}>
					{this.renderInput(saturation * 100, this.onSaturationChange, t('saturation'), 0, 100, 1)}
				</Label>
				<Label className={cx('nti-hsl-label')} label={t('lightness')}>
					{this.renderInput(lightness * 100, this.onLightnessChange, t('lightness'), 0, 100, 1)}
				</Label>
			</div>
		);
	}


	renderInput (value, onChange, placeholder, min, max, step) {
		return (
			<NumberInput
				className={cx('nti-hsl-number-input')}
				value={value}
				onChange={onChange}
				min={min}
				max={max}
				step={step}
				constrain
				placeholder={placeholder} />
		);
	}
}