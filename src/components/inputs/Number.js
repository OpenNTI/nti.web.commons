import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import zpad from 'zpad';

const getNumber = n => (n = parseInt(n, 10), isNaN(n) ? null : n);

export default class NumberInput extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.oneOfType([
			PropTypes.oneOf(['']),
			PropTypes.number
		]),
		onChange: PropTypes.func,
		pad: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.number
		]),
		max: PropTypes.number,
		min: PropTypes.number,
		step: PropTypes.number,

		onKeyPress: PropTypes.func,
		onKeyDown: PropTypes.func
	}

	static defaultProps = {
		step: 1
	}

	attachInputRef = (x) => this.input = x

	/**
	 * Convenience function. Prefer the 'value' property.
	 *
	 * @return {number} a number
	 */
	getValue () {
		return this.value;
	}


	get value () {
		return getNumber(this.input.value);
	}


	get validity () {
		const {value, min, max} = this.props;
		const input = Object.assign(document.createElement('input'), {type: 'number', value});

		if (!isNaN(min)) {
			input.min = min;
		}

		if (!isNaN(max)) {
			input.max = max;
		}

		return input.validity;
	}


	focus () {
		if (this.input) {
			this.input.focus();
		}
	}


	onValueChange (value) {
		const {onChange, value:oldValue} = this.props;

		if (value !== oldValue && onChange) {
			onChange(isNaN(value) ? '' : value);
		}
	}


	onInputChange = (e) => {
		this.onValueChange(getNumber(e.target.value));
	}


	handleUpKey () {
		const {value, step, max} = this.props;
		let newValue = getNumber(value || 0) + step;

		if (!isNaN(max)) {
			newValue = Math.min(newValue, getNumber(max));
		}

		this.onValueChange(newValue);
	}


	handleDownKey () {
		const {value, step, min} = this.props;
		let newValue = getNumber(value || 0) - step;

		if (!isNaN(min)) {
			newValue = Math.max(newValue, getNumber(min));
		}

		this.onValueChange(newValue);
	}


	/**
	 * Because of FIREFOX we still have to listen to KeyPress.
	 *
	 * @param  {Event} e KeyPress event.
	 * @return {void}
	 */
	onKeyPress = (e) => {
		//if the owner component wants a KeyPress listener, don't hijack it.
		const {onKeyPress, min} = this.props;//eslint-disable-line react/prop-types
		const minNumber = getNumber(min);
		const allowed = {
			44: ',',
			45: minNumber && minNumber < 0 ? '-' : false, //don't allow 'negative sign' if min is specified and positive.
			46: '.'
		};

		//If we aren't a number and we aren't one of allowed characters
		if ((e.charCode < 48 || e.charCode > 57) && !allowed[e.charCode]) {
			e.preventDefault();
		}

		if (onKeyPress) {
			onKeyPress(e);
		}
	}


	/**
	 * Listen for the keydown to get the up and down arrow events
	 *
	 * @param  {Event} e KeyDown event.
	 * @return {void}
	 */
	onKeyDown = (e) => {
		//if the owner component wants a KeyDown listener, don't hijack it.
		const {onKeyDown} = this.props;

		//up arrow
		if (e.keyCode === 38) {
			this.handleUpKey();
			e.preventDefault();
		}

		//down arrow
		if (e.keyCode === 40) {
			this.handleDownKey();
			e.preventDefault();
		}

		if (onKeyDown) {
			onKeyDown(e);
		}
	}


	render () {
		const {value: givenValue, className, pad, ...props} = this.props;

		let value = givenValue;

		if (pad) {
			value = zpad(value, (typeof pad === 'number') ? pad : 2);
		}

		return (
			<input {...props}
				type="text"
				pattern="[0-9]*"
				className={cx('number-input-component', className)}
				onKeyPress={this.onKeyPress}
				onKeyDown={this.onKeyDown}
				onChange={this.onInputChange}
				value={value}
				ref={this.attachInputRef}
			/>
		);
	}
}
