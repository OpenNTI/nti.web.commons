import './Text.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class TextInput extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.string,
		onChange: PropTypes.func,
		type: PropTypes.string
	}

	attachInputRef = x => this.input = x;

	/**
	 * Return the validity of the input see below for more details:
	 * https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
	 *
	 * @return {Object} the validity of the input
	 */
	get validity () {
		return this.input.validity;
	}


	focus () {
		if (this.input) {
			this.input.focus();
		}
	}


	onChange = (e) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(e.target.value, e);
		}
	}


	onClear = () => {
		const {onChange} = this.props;

		if (onChange) {
			onChange('');
		}

		this.focus();
	}


	render () {
		const {value, className, type = 'text', ...props} = this.props;
		return (
			<input {...props}
				className={cx('nti-text-input', className)}
				ref={this.attachInputRef}
				onChange={this.onChange}
				value={value || ''}
				type={type}
			/>
		);
	}
}
