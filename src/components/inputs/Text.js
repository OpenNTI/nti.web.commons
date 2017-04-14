import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';


const stop = e => e.preventDefault();

export default class TextInput extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.string,
		label: PropTypes.string,
		disableClear: PropTypes.bool,
		onChange: PropTypes.func
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
			onChange(e.target.value);
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
		const {value, label, className, disableClear, ...otherProps} = this.props;
		const cls = cx('nti-text-input', className, {'disable-clear': disableClear});

		delete otherProps.onChange;

		return (
			<label className={cls}>
				{label && (<span className="label">{label}</span>)}
				<span className="input-container">
					<input type="text" value={value} onChange={this.onChange} ref={this.attachInputRef} {...otherProps} />
					{!disableClear && (<div className="reset" onClick={this.onClear} onMouseDown={stop} />)}
				</span>
			</label>
		);
	}
}
