import './NumberInput.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import zpad from 'zpad';

import { getNumber } from './inputs/utils';

//TODO: stop using this and prefer the Number input component
export default class NumberInput extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.oneOfType([PropTypes.oneOf(['']), PropTypes.number]),
		onChange: PropTypes.func,
		pad: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
		max: PropTypes.number,
		min: PropTypes.number,
	};

	/**
	 * Convenience function. Prefer the 'value' property.
	 *
	 * @returns {number} a number
	 */
	getValue() {
		return this.value;
	}

	get value() {
		return getNumber(this.ref.value);
	}

	attachRef = x => (this.ref = x);

	focus = () => this.ref.focus();

	onChange = e => {
		const { onChange, max } = this.props;

		if (!isNaN(max) && this.value > parseInt(max, 10)) {
			return;
		}

		if (onChange) {
			onChange(e, this.value, this);
		}
	};

	/**
	 * Because of FIREFOX we still have to listen to KeyPress.
	 *
	 * @param  {Event} e KeyPress event.
	 * @returns {void}
	 */
	onKeyPress = e => {
		//if the owner component wants a KeyPress listener, don't hijack it.
		const { onKeyPress, min } = this.props; //eslint-disable-line react/prop-types
		const minNumber = parseInt(min, 10);
		const allowed = {
			44: ',',
			45: isNaN(minNumber) || minNumber < 0 ? '-' : false, //don't allow 'negative sign' if min is specified and positive.
			46: '.',
		};

		if ((e.charCode < 48 || e.charCode > 57) && !allowed[e.charCode]) {
			e.preventDefault();
			// console.log(e.charCode, e.key)
		}

		if (onKeyPress) {
			onKeyPress(e);
		}
	};

	render() {
		const { value: givenValue, className, pad, ...props } = this.props;
		let value = givenValue;

		if (pad) {
			value = zpad(value, typeof pad === 'number' ? pad : 2);
		}

		return (
			<input
				{...props}
				type="number"
				className={cx('number-input-component', className)}
				onChange={this.onChange}
				onKeyPress={this.onKeyPress}
				value={value}
				ref={this.attachRef}
			/>
		);
	}
}
