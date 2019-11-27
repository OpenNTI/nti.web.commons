import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import * as Flyout from '../../../flyout';

import Styles from './Flyout.css';
import Hue from './Hue';
import SaturationBrightness from './saturation-brightness';
import Text from './text';
import Preset from './preset-swatches';

const cx = classnames.bind(Styles);

ColorFlyout.ALIGNMENTS = Flyout.ALIGNMENTS;
ColorFlyout.propTypes = {
	className: PropTypes.string,
	swatches: PropTypes.array,
	value: PropTypes.shape({
		hex: PropTypes.shape({
			toString: PropTypes.func
		})
	}),
	onChange: PropTypes.func
};
export default function ColorFlyout ({className, onChange, value, swatches, ...otherProps}) {
	const style = {
		background: value ? value.hex.toString() : '#fff'
	};

	const trigger = (
		<span className={cx('color-flyout-trigger', className)} role="button" style={style} />
	);

	return (
		<Flyout.Triggered
			{...otherProps}
			trigger={trigger}
		>
			<div className={cx('color-flyout-picker')}>
				<SaturationBrightness value={value} onChange={onChange} />
				<Hue value={value} onChange={onChange} />
				<Text value={value} onChange={onChange} />
				<Preset swatches={swatches} selected={value} onSelect={onChange} />
			</div>
		</Flyout.Triggered>
	);
}