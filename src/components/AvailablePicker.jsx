import React, { PropTypes } from 'react';
import cx from 'classnames';
// import {scoped} from 'nti-lib-locale';
import autobind from 'nti-commons/lib/autobind';
import DayTimePicker from './DayTimePicker';
import Flyout from './Flyout';
import DateTime from './DateTime';
import Checkbox from './Checkbox';
import LabeledValue from './LabeledValue';

export default class AvailablePicker extends React.Component {
	static propTypes = {
		value: React.PropTypes.instanceOf(Date),
		label: React.PropTypes.string,
		checked: React.PropTypes.bool,
		onChange: PropTypes.func.isRequired
	}

	static defaultProps = {
		value: new Date(),
		label: 'Available Date',
		checked: true,
		changed: false
	}


	constructor (props) {
		super(props);

		this.setupValue(props);

		this.setFlyoutRef = x => this.flyoutRef = x;

		autobind(this, 'onDateChange', 'onSave', 'onCheckChange');
	}


	setupValue (props = this.props) {
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		const {value, checked} = props;
		const date = (value instanceof Date) ? value : new Date();

		setState({
			date,
			checked
		});
	}

	onDateChange (date) {
		this.setState({
			date,
			changed: true,
			dayClicked: true
		});
	}

	onCheckChange (e) {
		const newChecked = e.target.checked;
		const {checked:oldChecked} = this.state;

		if (newChecked !== oldChecked) {
			this.setState({
				checked: newChecked
			});
		}
	}

	onSave () {
		const {props: {onChange}, state: {changed}} = this;
		if (onChange && changed) {
			this.setState({changed: false});
			const p = onChange(this.getValue());

			if (p && p.then) {
				p.then(()=> this.closeMenu());
			}
		}
	}

	closeMenu () {
		if (this.flyoutRef) {
			this.flyoutRef.dismiss();
		}
	}

	getValue () {
		const {date, checked} = this.state;
		return checked ? date : null;
	}

	renderTrigger () {
		const {label} = this.props;
		const {date} = this.state;
		const format = 'L';
		const children = <DateTime date={date} format={format} />;

		return (
			<LabeledValue label={label} className="available-trigger" children={children} arrow="true" />
		);
	}

	render () {
		const {date, changed, checked} = this.state;
		const {label} = this.props;
		const saveClassNames = cx('available-save flyout-fullwidth-btn', {changed});
		return (
			<Flyout ref={this.setFlyoutRef} className="available-picker" alignment="bottom-left" trigger={this.renderTrigger()}>
				<Checkbox label={label} checked={checked} onChange={this.onCheckChange} />
				<DayTimePicker value={date} onChange={this.onDateChange} />
				<div className={saveClassNames} onClick={changed === true ? this.onSave : null}>Save</div>
			</Flyout>
		);
	}
}
