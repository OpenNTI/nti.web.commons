import './Text.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { filterProps } from '../../utils';

export default class TextInput extends React.Component {
	static propTypes = {
		autoFocus: PropTypes.bool,
		autoSelect: PropTypes.bool,
		placeholder: PropTypes.oneOfType([
			PropTypes.oneOf([false, null, undefined]),
			PropTypes.string,
		]),
		value: PropTypes.any,
		onChange: PropTypes.func,
		type: PropTypes.string,
	};

	attachInputRef = x => {
		this.input = x;
		if (this.props.autoFocus && x && !this.autoFocused) {
			// Auto focus will not fire after first mount
			this.autoFocused = true;
			setTimeout(() => x.focus(), 10);
		}
	};

	/**
	 * Return the validity of the input see below for more details:
	 * https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
	 *
	 * @returns {Object} the validity of the input
	 */
	get validity() {
		return this.input.validity;
	}

	get value() {
		return this.input?.value;
	}

	set value(v) {
		if (this.input) {
			this.input.value = v;
		}
	}

	focus() {
		if (this.input) {
			this.input.focus();
		}
	}

	onChange = e => {
		const { onChange } = this.props;

		if (onChange) {
			onChange(e.target.value, e);
		}
	};

	onClear = () => {
		const { onChange } = this.props;

		if (onChange) {
			onChange('');
		}

		this.focus();
	};

	onFocus = e => {
		try {
			e.target.setSelectionRange(0, e.target.value.length);
		} catch {
			// InvalidStateError: Failed to execute 'setSelectionRange' on 'HTMLInputElement': The input element's type ('email') does not support selection.
			// We tried... oh well.
		}
		 
		this.props.onFocus?.(e);
	};

	render() {
		const { value, className, placeholder, ...props } = this.props;

		return (
			<input
				type="text"
				{...filterProps(props, 'input')}
				placeholder={placeholder || null}
				onFocus={this.onFocus}
				className={cx('nti-text-input', className)}
				ref={this.attachInputRef}
				onChange={'onChange' in this.props ? this.onChange : undefined}
				value={'value' in this.props ? value || '' : undefined}
			/>
		);
	}
}
