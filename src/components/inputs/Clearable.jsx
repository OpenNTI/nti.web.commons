import './Clearable.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { getRefHandler } from '@nti/lib-commons';

const stop = e => e.preventDefault();

export default class ClearableInput extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.element,
		onClear: PropTypes.func,
	};

	attachInputRef = x => (this.input = x);

	get validity() {
		return this.input && this.input.validity;
	}

	focus() {
		if (this.input && this.input.focus) {
			this.input.focus();
		}
	}

	onClear = () => {
		const { children, onClear } = this.props;

		if (onClear) {
			return onClear(this.input);
		}

		const child = React.Children.only(children);
		const { onChange } = child.props;

		if (onChange) {
			onChange(null);
		}
	};

	render() {
		const { children, className, onClear, ...props } = this.props;
		const child = React.Children.only(children);
		return (
			<div className={cx('nti-clearable-input', className)} {...props}>
				{React.cloneElement(child, {
					ref: getRefHandler(child.ref, this.attachInputRef),
				})}
				<div
					className="reset"
					onClick={this.onClear}
					onMouseDown={stop}
				/>
			</div>
		);
	}
}
