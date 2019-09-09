import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Color, restProps} from '@nti/lib-commons';

import Styles from './Hue.css';
import Thumb from './Thumb';

const cx = classnames.bind(Styles);

function getStyle (percent) {
	return {
		left: `calc(${percent}% - ${14 * (percent / 100)}px)`
	};
}

export default class HueInput extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.shape({
			hsv: PropTypes.shape({
				hue: PropTypes.number,
				setHue: PropTypes.func
			})
		}),

		onChange: PropTypes.func
	}

	state = {}

	onChange = (e) => {
		const {onChange, value} = this.props;
		const hue = (parseInt(e.target.value, 10) / 100) * 360;
		const newValue = value ? value.hsv.setHue(hue) : Color.fromHSL(hue, 1, 0.5);

		if (onChange) {
			onChange(newValue, e);
		}
	}


	render () {
		const {className, value} = this.props;
		const {focusVisible} = this.state;
		const otherProps = restProps(HueInput, this.props);
		const hue = value ? (value.hsv.hue % 360) : 0;
		const percent = Math.round((hue / 360) * 100);

		if ('onChange' in this.props) {
			otherProps.onChange = this.onChange;
		}

		if ('value' in this.props) {
			otherProps.value = percent;
		}

		return (
			<div className={cx('nti-hue-input', 'hue-input', className, {'focus-visible': focusVisible})}>
				<div className={cx('bar')} />
				<Thumb
					className={cx('hue-thumb')}
					value={value}
					style={getStyle(percent)}
				/>
				<input
					{...otherProps}
					type="range"
					className={cx('range')}
					min="0"
					max="100"
					step="1"
				/>
			</div>
		);
	}
}