import './TextArea.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class TextArea extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		inputClassName: PropTypes.string,
		value: PropTypes.string,
		onChange: PropTypes.func,
		autoGrow: PropTypes.bool,
		placeholder: PropTypes.string,
	};

	attachInputRef = x => (this.input = x);

	/**
	 * Return the validity of the input see below for more details:
	 * https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
	 *
	 * @returns {Object} the validity of the input
	 */
	get validity() {
		return this.input.validity;
	}

	focus() {
		if (this.input) {
			this.input.focus();
		}
	}

	onChange = e => {
		const { onChange } = this.props;

		if (onChange) {
			onChange(e.target.value);
		}
	};

	onClear = () => {
		const { onChange } = this.props;

		if (onChange) {
			onChange('');
		}

		this.focus();
	};

	render() {
		const {
			value,
			inputClassName,
			className,
			autoGrow,
			placeholder,
			...otherProps
		} = this.props;

		const sizerCls = cx(
			'sizer',
			{ 'textarea-text': autoGrow },
			{ placeholder: !value && placeholder }
		);
		const textareaCls = cx('textarea', 'textarea-text', inputClassName, {
			autogrow: autoGrow,
		});

		delete otherProps.onChange;

		return (
			<div className={cx('textarea-container', className)}>
				{autoGrow && (
					<div
						className={sizerCls}
						dangerouslySetInnerHTML={{
							__html: (value || placeholder || '') + '|',
						}}
					/>
				)}
				<textarea
					className={textareaCls}
					type="text"
					value={value || ''}
					onChange={this.onChange}
					ref={this.attachInputRef}
					placeholder={placeholder}
					{...otherProps}
				/>
			</div>
		);
	}
}
