import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Color, restProps } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';

import NumberInput from '../../Number';
import Label from '../../Label';

import Styles from './RGB.css';

const cx = classnames.bind(Styles);
const t = scoped('common.inputs.color.text.RGB', {
	red: 'R',
	green: 'G',
	blue: 'B',
});

export default class NTIRGBInput extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.shape({
			rgb: PropTypes.shape({
				red: PropTypes.string,
				green: PropTypes.string,
				blue: PropTypes.string,
				setRed: PropTypes.func,
				setGreen: PropTypes.func,
				setBlue: PropTypes.func,
			}),
		}),

		onChange: PropTypes.func,
	};

	onRedChange = (red, e) => {
		const { onChange, value } = this.props;
		const newValue = value
			? value.rgb.setRed(red)
			: Color.fromRGB(red, 0, 0);

		if (onChange) {
			onChange(newValue, e);
		}
	};

	onGreenChange = (green, e) => {
		const { onChange, value } = this.props;
		const newValue = value
			? value.rgb.setGreen(green)
			: Color.fromRGB(0, green, 0);

		if (onChange) {
			onChange(newValue, e);
		}
	};

	onBlueChange = (blue, e) => {
		const { onChange, value } = this.props;
		const newValue = value
			? value.rgb.setBlue(blue)
			: Color.fromRGB(0, 0, blue);

		if (onChange) {
			onChange(newValue, e);
		}
	};

	render() {
		const { value, className } = this.props;
		const otherProps = restProps(NTIRGBInput, this.props);
		const red = value ? value.rgb.red : 0;
		const green = value ? value.rgb.green : 0;
		const blue = value ? value.rgb.blue : 0;

		return (
			<div className={cx('nti-rgb-input', className)} {...otherProps}>
				<Label className={cx('nti-rgb-label')} label={t('red')}>
					{this.renderInput(red, this.onRedChange, t('red'))}
				</Label>
				<Label className={cx('nti-rgb-label')} label={t('green')}>
					{this.renderInput(green, this.onGreenChange, t('green'))}
				</Label>
				<Label className={cx('nti-rgb-label')} label={t('blue')}>
					{this.renderInput(blue, this.onBlueChange, t('blue'))}
				</Label>
			</div>
		);
	}

	renderInput(value, onChange, placeholder) {
		return (
			<NumberInput
				className={cx('nti-rgb-number-input')}
				value={value}
				onChange={onChange}
				min={0}
				max={255}
				constrain
				step={1}
				placeholder={placeholder}
			/>
		);
	}
}
