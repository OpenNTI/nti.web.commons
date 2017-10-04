import React from 'react';
import PropTypes from 'prop-types';

export default class Toggle extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		hideLabel: PropTypes.bool,
		value: PropTypes.bool,
		onChange: PropTypes.func
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
		return (<div className="toggler-container">
			{this.renderOnOff()}
			{this.renderToggler()}
		</div>);
	}

	renderOnOff () {
		const { value, hideLabel } = this.props;

		if(hideLabel) {
			return null;
		}

		const cls = value ? 'toggle-label on' : 'toggle-label off';
		const text = value ? 'ON' : 'OFF';

		return (<div className={cls}>{text}</div>);
	}

	renderToggler () {
		const { value } = this.props;

		let togglerCls = 'toggler';
		let buttonCls = 'toggle-button';

		if(value) {
			togglerCls += ' on';
			buttonCls += ' on';
		}
		else {
			togglerCls += ' off';
			buttonCls += ' off';
		}

		return (
			<div className={togglerCls}>
				<input onChange={this.toggleValue} checked={value} type="checkbox" ref={this.attachInputRef}/>
				<div className={buttonCls}/>
			</div>
		);
	}

	render () {
		const { className } = this.props;

		const cls = className ? 'nti-toggle-input ' + className : 'nti-toggle-input';

		return (<div className={cls}>
			{this.renderToggle()}
		</div>);
	}
}
