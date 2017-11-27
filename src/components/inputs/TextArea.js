import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class TextArea extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.string,
		onChange: PropTypes.func,
		syncSize: PropTypes.bool
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
		const {value, className, syncSize, ...otherProps} = this.props;
		const cls = cx('nti-text-area', className, { syncSize });
		const containerCls = cx('textarea-container', { syncSize });

		delete otherProps.onChange;

		return (
			<div className={containerCls}>
				{syncSize && <div className="sizer" dangerouslySetInnerHTML={{ __html: value + '|' }} />}
				<textarea className={cls} type="text" value={value || ''} onChange={this.onChange} ref={this.attachInputRef} {...otherProps} />
			</div>
		);
	}
}
