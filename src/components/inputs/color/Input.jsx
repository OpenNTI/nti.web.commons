import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Color, restProps} from '@nti/lib-commons';

import Hue from './Hue';
import SaturationBrightness from './saturation-brightness';
import Text from './text';
import PresetSwatches from './preset-swatches';
import Thumb from './Thumb';
import Flyout from './Flyout';

export default class ColorInput extends React.Component {
	static Hue = Hue;
	static SaturationBrightness = SaturationBrightness;
	static PresetSwatches = PresetSwatches;
	static Text = Text;
	static Thumb = Thumb;
	static Flyout = Flyout;

	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.object,

		onChange: PropTypes.func
	}

	attachInputRef = x => this.input = x;


	/**
	 * Return the validity of the input see below for more details:
	 * https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
	 *
	 * @return {Object} the validity of the input
	 */
	get validity () {
		return this.input.validity;
	}

	onChange = (e) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(Color(e.target.value), e);
		}
	}


	render () {
		const {className, value} = this.props;
		const otherProps = restProps(ColorInput, this.props);

		if ('onChange' in this.props) {
			otherProps.onChange = this.onChange;
		}

		if ('value' in this.props) {
			otherProps.value = value ? value.rgb.setAlpha(1).hex.toString() : '';
		}

		return (
			<input
				{...otherProps}
				className={cx('nti-color-input', className)}
				type="color"
				ref={this.attachInputRef}
			/>
		);
	}
}
