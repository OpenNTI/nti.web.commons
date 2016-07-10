import React, { PropTypes } from 'react';
import cx from 'classnames';
import DayTimePicker from './day-time/DayTimePicker';
import Flyout from './flyout';
import DateTime from './DateTime';
import Checkbox from './Checkbox';
import LabeledValue from './LabeledValue';
import TinyLoader from './TinyLoader';

export default class AvailablePicker extends React.Component {
	static propTypes = {
		value: PropTypes.instanceOf(Date),
		label: PropTypes.string,
		onChange: PropTypes.func.isRequired,
		saving: PropTypes.bool,
		error: PropTypes.any
	}

	static defaultProps = {
		value: new Date(),
		label: 'Available Date'
	}


	constructor (props) {
		super(props);
		this.setupValue(props);
	}


	setFlyoutRef = x => this.flyoutRef = x


	setupValue (props = this.props) {
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		const {value} = props;

		setState({
			date: value,
			checked: value !== null
		});
	}


	componentWillReceiveProps (nextProps) {
		if (nextProps.value !== this.props.value) {
			this.setupValue(nextProps);
		}
	}


	onDateChange = (date) => {
		this.setState({
			date,
			checked: true
		});
	}


	onCheckChange = (e) => {
		const checked = e.target.checked;
		const {date, checked:oldChecked} = this.state;
		const newValue = checked ? date : null;

		if (checked !== oldChecked) {
			this.setState({
				date: newValue,
				checked
			});
		}
	}


	onSave = () => {
		const {props: {onChange, value}, state: {date}} = this;
		const changed = value !== date;

		if (onChange && changed) {
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
		return this.state.date;
	}


	renderTrigger () {
		const {
			state: {date},
			props: {label}
		} = this;
		const hasValue = date !== null;
		const placeholder = 'No Due Date';
		const labelClasses = cx({
			'placeholder': date === null
		});

		return (
			<LabeledValue label={label} className="available-trigger" arrow>
				{hasValue ? <DateTime date={date} format="L"/> : <span className={labelClasses}>{placeholder}</span>}
			</LabeledValue>
		);
	}


	render () {
		const {date, checked} = this.state;
		const {label, saving, value} = this.props;
		const changed = value !== date;
		const saveClassNames = cx('available-save flyout-fullwidth-btn', {changed});

		return (
			<Flyout
				ref={this.setFlyoutRef}
				className="available-picker"
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				trigger={this.renderTrigger()}
			>
				<Checkbox label={label} checked={checked} onChange={this.onCheckChange} />
				<DayTimePicker value={date} onChange={this.onDateChange} />
				{saving ? <TinyLoader /> : <div className={saveClassNames} onClick={this.onSave}>Save</div>}
			</Flyout>
		);
	}
}
