import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import * as Flyout from '../../../flyout';
import { filterProps } from '../../../utils';

import HueBase from './Hue';
import SaturationBrightness from './saturation-brightness';
import Text from './text';
import Preset from './preset-swatches';

const Trigger = styled('span').attrs(props => {
	debugger;
	return ({
		...props,
		className: cx('color-flyout-trigger', props.className),
		role: 'button',
	});
})`
	display: inline-block;
	width: 25px;
	height: 25px;
	border-radius: 25px;
	border: 3px solid white;
	box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.3);
	cursor: pointer;
`;

const Picker = styled('div').attrs(props => ({
	...filterProps(props, 'div'),
	'data-color-picker-panel': true,
	className: cx('color-flyout-picker', props.className),
}))`
	padding: 0.5rem;
`;

const Hue = styled(HueBase)`
	margin: 10px 0;
`;

ColorFlyout.ALIGNMENTS = Flyout.ALIGNMENTS;
ColorFlyout.propTypes = {
	className: PropTypes.string,
	swatches: PropTypes.array,
	value: PropTypes.shape({
		hex: PropTypes.shape({
			toString: PropTypes.func,
		}),
	}),
	onChange: PropTypes.func,
};
export default function ColorFlyout({
	className,
	onChange,
	value,
	swatches,
	...otherProps
}) {
	const trigger = (
		<Trigger
			className={className}
			style={{
				background: `${value?.hex || '#fff'}`,
			}}
		/>
	);

	return (
		<Flyout.Triggered {...otherProps} trigger={trigger}>
			<Picker className={className}>
				<SaturationBrightness value={value} onChange={onChange} />
				<Hue value={value} onChange={onChange} />
				<Text value={value} onChange={onChange} />
				<Preset
					swatches={swatches}
					selected={value}
					onSelect={onChange}
				/>
			</Picker>
		</Flyout.Triggered>
	);
}
