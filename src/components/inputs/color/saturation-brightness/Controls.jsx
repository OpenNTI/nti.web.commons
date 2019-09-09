import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Thumb from '../Thumb';

import Styles from './Input.css';

const cx = classnames.bind(Styles);

function getStyle (percent) {
	return `calc(${percent}% - ${14 * (percent / 100)}px)`;
}

export default class SaturationBrightnessControls extends React.Component {
	static propTypes = {
		value: PropTypes.shape({
			hsv: PropTypes.shape({
				saturation: PropTypes.number,
				brightness: PropTypes.number
			}).isRequired
		})
	}


	render () {
		return (
			<div className={cx('controls')}>
				{this.renderThumb()}
			</div>
		);
	}

	renderThumb () {
		const {value} = this.props;

		if (!value) { return null; }

		const {saturation, brightness} = value.hsv;
		const style = {
			top: getStyle(100 * (1 - (brightness || 0))),
			left: getStyle(100 * (saturation || 0))
		};

		return (
			<Thumb className={cx('saturation-brightness-thumb')} style={style} value={value} />
		);
	}
}