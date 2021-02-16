import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { scoped } from '@nti/lib-locale';

import style from './Toggle.css';
const cx = classnames.bind(style);

const DEFAULT_TEXT = {
	on: 'On',
	off: 'Off',
};

const t = scoped(
	'common.components.course.overview.controls.toggle',
	DEFAULT_TEXT
);

export default class Toggle extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		hideLabel: PropTypes.bool,
		value: PropTypes.bool,
		onChange: PropTypes.func,
		disabled: PropTypes.bool,
		iconOff: PropTypes.func,
		iconOn: PropTypes.func,
		classes: PropTypes.shape({
			root: PropTypes.string,
			toggler: PropTypes.string,
			label: PropTypes.string,
			button: PropTypes.string,
			icons: PropTypes.string,
			icon: PropTypes.string,
			iconOff: PropTypes.string,
			iconOn: PropTypes.string,
		}),
	};

	attachInputRef = x => (this.input = x);

	constructor(props) {
		super(props);
	}

	get validity() {
		return this.input.validity;
	}

	focus() {
		if (this.input) {
			this.input.focus();
		}
	}

	toggleValue = e => {
		const { onChange } = this.props;

		onChange && onChange(e.target.checked);
	};

	hasIcons = () => !!(this.props.iconOn || this.props.iconOff);

	renderOnOff() {
		const { value, hideLabel, classes = {} } = this.props;

		if (hideLabel) {
			return null;
		}

		const cls = cx('toggle-label', classes.label, {
			on: value,
			off: !value,
		});
		const text = value ? t('on') : t('off');

		return <div className={cls}>{text}</div>;
	}

	renderIcons() {
		const { iconOff, iconOn, classes = {} } = this.props;
		const c = (x, ...other) => cx('toggle-icon', classes.icon, x, ...other);

		return !this.hasIcons() ? null : (
			<div className={cx('icons', classes.icons)}>
				{[
					{
						icon: iconOff,
						className: c('icon-off', classes.iconOff),
					},
					{ icon: iconOn, className: c('icon-on', classes.iconOn) },
				]
					.filter(({ icon }) => !!icon)
					.map(({ icon: Icon, className }) => (
						<div key={className} className={className}>
							<Icon />
						</div>
					))}
			</div>
		);
	}

	renderToggler() {
		const { value, disabled, classes = {} } = this.props;

		const togglerCls = cx('toggler', classes.toggler, {
			on: value,
			off: !value,
			disabled,
		});
		const buttonCls = cx('toggle-button', classes.button, {
			on: value,
			off: !value,
		});

		return (
			<div className={togglerCls}>
				<input
					onChange={this.toggleValue}
					checked={value}
					type="checkbox"
					ref={this.attachInputRef}
					disabled={disabled}
				/>
				<div className={buttonCls} />
				{this.renderIcons()}
			</div>
		);
	}

	render() {
		const { className, classes = {} } = this.props;

		return (
			<div
				className={cx(
					'nti-toggle-input',
					{ 'with-icons': this.hasIcons() },
					classes.root,
					className
				)}
			>
				<div className={cx('toggler-container')}>
					{this.renderOnOff()}
					{this.renderToggler()}
				</div>
			</div>
		);
	}
}
