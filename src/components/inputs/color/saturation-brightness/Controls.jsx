import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Color } from '@nti/lib-commons';

import Thumb from '../Thumb';

import Styles from './Input.css';
import {
	computeSaturationBrightnessForPoint,
	updateSaturationBrightnessForKeyEvent,
} from './utils';

const cx = classnames.bind(Styles);

function getStyle(percent) {
	return `${percent}%`;
}

export default class SaturationBrightnessControls extends React.Component {
	static propTypes = {
		value: PropTypes.shape({
			hsv: PropTypes.shape({
				hue: PropTypes.number,
				saturation: PropTypes.number,
				brightness: PropTypes.number,
			}).isRequired,
		}),
		onChange: PropTypes.func,
	};

	control = React.createRef();
	state = {};

	get current() {
		const { movingOverride } = this.state;
		const { value } = this.props;

		if (!value) {
			return null;
		}

		const { saturation: overrideS, brightness: overrideV } =
			movingOverride || {};
		const { saturation: valueS, brightness: valueV } = value.hsv;

		return {
			saturation: overrideS || valueS,
			brightness: overrideV || valueV,
		};
	}

	componentWillUnmount() {
		this.unmounted = true;
		if (this.cleanupMouseListeners) {
			this.cleanupMouseListeners();
		}
	}

	update({ saturation, brightness }) {
		const { value, onChange } = this.props;
		const oldValue = value ? value : Color.fromHSL(0, 1, 0.5);
		const newValue = Color.fromHSV(
			oldValue.hsv.hue,
			saturation,
			brightness
		);

		if (
			(onChange && oldValue.hsv.saturation !== newValue.hsv.saturation) ||
			oldValue.hsv.brightness !== newValue.hsv.brightness
		) {
			onChange(newValue);
		}
	}

	setupMouseListeners() {
		if (this.cleanupMouseListeners) {
			this.cleanupMouseListeners();
		}

		if (!global.addEventListener) {
			return;
		}

		const mousemove = e => this.onMouseMove(e);
		const mouseup = e => this.onMouseUp(e);

		global.addEventListener('mousemove', mousemove);
		global.addEventListener('mouseup', mouseup);

		this.cleanupMouseListeners = () => {
			global.removeEventListener('mousemove', mousemove);
			global.removeEventListener('mouseup', mouseup);

			delete this.cleanupMouseListeners;
		};
	}

	onMouseDown = e => {
		this.update(
			computeSaturationBrightnessForPoint(
				e.clientX,
				e.clientY,
				this.control.current
			)
		);

		this.setupMouseListeners();
	};

	onMouseMove = e => {
		this.setState({
			movingOverride: computeSaturationBrightnessForPoint(
				e.clientX,
				e.clientY,
				this.control.current
			),
		});

		clearTimeout(this.moveTimeout);
		this.moveTimeout = setTimeout(() => {
			const { movingOverride } = this.state;

			this.update(movingOverride);
			this.setState({ movingOverride: null });
		}, 50);
	};

	onMouseUp = e => {
		if (this.cleanupMouseListeners) {
			this.cleanupMouseListeners();
		}
	};

	onKeyDown = e => {
		const { current } = this;

		if (!current) {
			return;
		}

		this.setState({
			movingOverride: updateSaturationBrightnessForKeyEvent(
				e,
				this.current
			),
		});

		clearTimeout(this.keyTimeout);
		this.keyTimeout = setTimeout(() => {
			const { movingOverride } = this.state;

			this.update(movingOverride);
			this.setState({ movingOverride: null });
		}, 50);
	};

	render() {
		return (
			<div
				className={cx('controls')}
				onMouseDown={this.onMouseDown}
				onKeyDown={this.onKeyDown}
				ref={this.control}
				tabIndex={0}
			>
				{this.renderThumb()}
			</div>
		);
	}

	renderThumb() {
		const { value } = this.props;

		if (!value) {
			return null;
		}

		const { saturation, brightness } = this.current || {};
		const style = {
			top: getStyle(100 * (1 - (brightness || 0))),
			left: getStyle(100 * (saturation || 0)),
		};

		const thumbValue = Color.fromHSV(value.hsv.hue, saturation, brightness);

		return (
			<Thumb
				className={cx('saturation-brightness-thumb')}
				style={style}
				value={thumbValue}
			/>
		);
	}
}
