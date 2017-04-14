import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import zpad from 'zpad';

const getNumber = n => (n = parseFloat(n, 10), isNaN(n) ? null : n);

export default class NumberInput extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.number,
		label: PropTypes.string,
		onChange: PropTypes.func,

		constrain: PropTypes.bool,
		pad: PropTypes.oneOfType([
			PropTypes.bool,
			PropTypes.number
		]),

		max: PropTypes.number,
		min: PropTypes.number,
		step: PropTypes.number,
		//TODO: implement stepUp and stepDown props

		onKeyPress: PropTypes.func,
		onKeyDown: PropTypes.func,

		onIncrement: PropTypes.func,
		onDecrement: PropTypes.func
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

	/**
	 * Return the value of the input, you shouldn't need to use this though.
	 *
	 * @return {String} the value of the input
	 */
	get value () {
		return getNumber(this.input.value);
	}

	/**
	 * Since we are using text input for usability (namely leading zeros, looking at you FF)
	 * create a number input to check validity, see below for more details:
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
	 *
	 * @return {Object} the validity of the input
	 */
	get validity () {
		const {value, min, max} = this.props;
		const input = Object.assign(document.createElement('input'), {type: 'number', value});

		if (!isNaN(min)) {
			input.min = min;
		}

		if (!isNaN(max)) {
			input.max = max;
		}

		return input.validit || {};//or with {} for testing
	}


	focus () {
		if (this.input) {
			this.input.focus();
		}
	}


	onValueChange (value) {
		const {onChange, value:oldValue, min, max, constrain} = this.props;

		if (constrain && !isNaN(max)) {
			value = Math.min(value, getNumber(max));
		}

		if (constrain && !isNaN(min)) {
			value = Math.max(value, getNumber(min));
		}

		if (value !== oldValue && onChange) {
			onChange(isNaN(value) ? '' : value);
		}
	}


	onInputChange = (e) => {
		this.onValueChange(getNumber(e.target.value));
	}


	handleUpKey () {
		const {value, step, max, min, onIncrement} = this.props;
		let newValue = getNumber(value || 0);

		if (onIncrement) { return onIncrement(); }

		//If the newValue is already greater than the max
		//don't do anything
		if (newValue >= max) { return; }

		newValue += step;

		if (!isNaN(max)) {
			newValue = Math.min(newValue, getNumber(max));
		}

		if (!isNaN(min)) {
			newValue = Math.max(newValue, getNumber(min));
		}


		this.onValueChange(newValue);
	}


	handleDownKey () {
		const {value, step, min, max, onDecrement} = this.props;
		let newValue = getNumber(value || 0);

		if (onDecrement) { return onDecrement(); }

		//If the newValue is already less than the min
		//don't do anything
		if (newValue <= min) { return; }

		newValue -= step;

		if (!isNaN(min)) {
			newValue = Math.max(newValue, getNumber(min));
		}

		if (!isNaN(max)) {
			newValue = Math.min(newValue, getNumber(max));
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
		const {onKeyPress, min} = this.props;
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
		const {value: givenValue, className, pad, label, ...otherProps} = this.props;
		const {validity} = this;
		const cls = cx('number-input-component', className, {valid: validity.valid, invalid: !validity.valid});

		let value = givenValue;

		if (pad) {
			value = zpad(value, (typeof pad === 'number') ? pad : 2);
		}

		delete otherProps.constrain;
		delete otherProps.onIncrement;
		delete otherProps.onDecrement;

		//TODO: add a label prop similar to whats in the text input

		return (
			<label className={cls}>
				{label && (<span className="label">{label}</span>)}
				<input {...otherProps}
					type="text"
					pattern="[0-9]*"
					onKeyPress={this.onKeyPress}
					onKeyDown={this.onKeyDown}
					onChange={this.onInputChange}
					value={value == null ? '' : value}
					ref={this.attachInputRef}
				/>
			</label>
		);
	}
}
