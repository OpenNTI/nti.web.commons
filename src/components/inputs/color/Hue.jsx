import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {Color, restProps} from '@nti/lib-commons';

import Styles from './Hue.css';
import Thumb from './Thumb';

const cx = classnames.bind(Styles);

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



	onChange = (e) => {
		const {onChange, value} = this.props;
		const hue = parseInt(e.target.value, 10);
		const newValue = value ? value.hsv.setHue(hue) : Color.fromHSL(hue, 1, 0.5);

		if (onChange) {
			onChange(newValue, e);
		}
	}


	render () {
		const {className, value} = this.props;
		const otherProps = restProps(HueInput, this.props);

		if ('onChange' in this.props) {
			otherProps.onChange = this.onChange;
		}

		if ('value' in this.props) {
			otherProps.value = value ? (value.hsv.hue % 360) : 0;
		}

		const left = Math.round((otherProps.value / 360) * 100);

		return (
			<div className={cx('nti-hue-input', 'hue-input', className)}>
				<div className={cx('bar')} />
				<Thumb
					className={cx('hue-thumb')}
					value={value}
					style={{left: `${left}%`}}
				/>
				<input
					{...otherProps}
					type="range"
					className={cx('range')}
					min="0"
					max="360"
					step="1"
				/>
			</div>
		);
	}
}