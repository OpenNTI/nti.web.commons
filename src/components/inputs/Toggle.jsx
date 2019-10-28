import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

const DEFAULT_TEXT = {
	on: 'On',
	off: 'Off'
};

const t = scoped('common.components.course.overview.controls.toggle', DEFAULT_TEXT);

export default class Toggle extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		hideLabel: PropTypes.bool,
		value: PropTypes.bool,
		onChange: PropTypes.func,
		disabled: PropTypes.bool
	}

	attachInputRef = x => this.input = x;

	constructor (props) {
		super(props);
	}

	get validity () {
		return this.input.validity;
	}

	focus () {
		if (this.input) {
			this.input.focus();
		}
	}

	toggleValue = (e) => {
		const { onChange } = this.props;

		onChange && onChange(e.target.checked);
	}

	renderToggle () {
		return (
			<div className="toggler-container">
				{this.renderOnOff()}
				{this.renderToggler()}
			</div>
		);
	}

	renderOnOff () {
		const { value, hideLabel } = this.props;

		if(hideLabel) {
			return null;
		}

		const cls = cx('toggle-label', {on: value, off: !value});
		const text = value ? t('on') : t('off');

		return (<div className={cls}>{text}</div>);
	}

	renderToggler () {
		const { value, disabled } = this.props;

		const togglerCls = cx('toggler', {on: value, off: !value, disabled});
		const buttonCls = cx('toggle-button', {on: value, off: !value});

		return (
			<div className={togglerCls}>
				<input onChange={this.toggleValue} checked={value} type="checkbox" ref={this.attachInputRef} disabled={disabled}/>
				<div className={buttonCls}/>
			</div>
		);
	}

	render () {
		const { className } = this.props;

		return (
			<div className={cx('nti-toggle-inpout', className)}>
				{this.renderToggle()}
			</div>
		);
	}
}
