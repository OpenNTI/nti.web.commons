import React from 'react';
import cx from 'classnames';

export default class TextInput extends React.Component {
	static propTypes = {
		className: React.PropTypes.string,
		value: React.PropTypes.string,
		label: React.PropTypes.string,
		disableClear: React.PropTypes.bool,
		onChange: React.PropTypes.func
	}

	attachInputRef = x => this.input = x;


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
	}


	render () {
		const {value, label, className, disableClear, ...otherProps} = this.props;
		const cls = cx('nti-text-input', className);


		return (
			<label className={cls}>
				{label && (<span className="label">{label}</span>)}
				<input type="text" value={value} onChange={this.onChange} ref={this.attachInputRef} {...otherProps} />
				{!disableClear && (<i className="icon-light-x" onClick={this.onClear} />)}
			</label>
		);
	}
}
