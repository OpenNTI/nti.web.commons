import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const stop = e => e.preventDefault();

export default class ClearableInput extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		children: React.PropTypes.element,
		onClear: React.PropTypes.func
	}

	attachInputRef = x => this.input = x

	get validity () {
		return this.input && this.input.validity;
	}


	focus () {
		if (this.input && this.input.focus) {
			this.input.focus();
		}
	}

	onClear = () => {
		const {children, onClear} = this.props;

		if (onClear) {
			return onClear();
		}

		const child = React.Children.only(children);
		const {onChange} = child.props;

		if (onChange) {
			onChange(null);
		}
	}


	render () {
		const {className} = this.props;
		const cls = cx('nti-clearable-input', className);

		return (
			<div className={cls}>
				{this.renderInput()}
				<div className="reset" onClick={this.onClear} onMouseDown={stop} />
			</div>
		);
	}


	renderInput = () => {
		const {children} = this.props;
		const child = React.Children.only(children);

		return React.cloneElement(child, {ref: this.attachInputRef});
	}
}
