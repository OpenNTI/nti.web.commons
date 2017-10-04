import React from 'react';
import PropTypes from 'prop-types';

export default class Toggle extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.bool,
		onValueChange: PropTypes.func
	}

	constructor (props) {
		super(props);
	}

	toggleValue = () => {
		const { onValueChange, value } = this.props;
		const newValue = !value;

		onValueChange && onValueChange(newValue);
	}

	renderToggle () {
		return (<div className="toggler-container">
			{this.renderOnOff()}
			{this.renderToggler()}
		</div>);
	}

	renderOnOff () {
		const { value } = this.props;

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

		return (<div onClick={this.toggleValue} className={togglerCls}><div className={buttonCls}/></div>);
	}

	render () {
		const { className } = this.props;

		const cls = className ? 'nti-toggle-input ' + className : 'nti-toggle-input';

		return (<div className={cls}>
			{this.renderToggle()}
		</div>);
	}
}
