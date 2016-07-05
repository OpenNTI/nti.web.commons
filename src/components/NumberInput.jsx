import React from 'react';
import cx from 'classnames';
import zpad from 'zpad';

const getNumber = n => (n = parseInt(n, 10), isNaN(n) ? null : n);

export default class NumbertInput extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		value: React.PropTypes.oneOfType([
			React.PropTypes.oneOf(['']),
			React.PropTypes.number
		]),
		onChange: React.PropTypes.func,
		pad: React.PropTypes.oneOfType([
			React.PropTypes.bool,
			React.PropTypes.number
		])
	}


	/**
	 * Convenience function. Prefer the 'value' property.
	 *
	 * @return {number} a number
	 */
	getValue () {
		return this.value;
	}


	get value () {
		return getNumber(this.ref.value);
	}


	attachRef = (x) => this.ref = x


	focus = () => this.ref.focus()


	onChange = (e) => {
		const {onChange} = this.props;
		if (onChange) {
			onChange(e, this.value, this);
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
				type="number"
				className={cx('number-input-component', className)}
				onChange={this.onChange}
				value={value}
				ref={this.attachRef}
				/>
		);
	}
}
