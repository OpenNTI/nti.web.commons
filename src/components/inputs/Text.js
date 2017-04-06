import React from 'react';
import cx from 'classnames';


const stop = e => e.preventDefault();

export default class TextInput extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		value: React.PropTypes.string,
		label: React.PropTypes.string,
		disableClear: React.PropTypes.bool,
		onChange: React.PropTypes.func
	}

	attachInputRef = x => this.input = x;


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
