import React, {PropTypes} from 'react';
import Picker, { DateUtils, WeekdayPropTypes } from 'react-day-picker';

export {DateUtils};

function Weekday ({ weekday, className, localeUtils, locale }) {
	const weekdayName = localeUtils.formatWeekdayLong(weekday, locale);
	return (
		<div className={className} title={weekdayName}>
			{weekdayName.slice(0, 1)}
		</div>
	);
}

Weekday.propTypes = WeekdayPropTypes;

export default class DayPicker extends React.Component {
	static propTypes = {
		value: PropTypes.object,
		onChange: PropTypes.func,
		disabledDays: PropTypes.func
	}


	static defaultProps = {
		value: new Date()
	}


	constructor (props) {
		super(props);
		const {value} = props;

		this.state = {
			value
		};

		this.handleDayClick = this.handleDayClick.bind(this);
		this.selectedDays = day => DateUtils.isSameDay(this.getValue(), day);
	}


	getValue (props = this.props) {
		return props.value || this.state.value;
	}

	/**
	 * Handles a day being clicked
	 * @param  {event} e - Click event.
	 * @param  {Date} day - This is the day that was clicked.
	 * @param  {object} modifiers - Modifiers from react-day-picker
	 * @param  {boolean} modifiers.selected - This is true if the day clicked is currently selected.
	 * @param  {boolean} modifiers.disabled - This is true if the day is disabled.
	 * @return {void}
	 */
	handleDayClick (e, day, { selected, disabled }) {
		const {onChange} = this.props;
		const value = selected ? null : day;

		e.preventDefault();

		if (disabled || value == null) { return; }

		if(onChange) {
			onChange(value);
		}

		this.setState({
			value
		});
	}


	render () {
		return (
			<Picker
				weekdayComponent={ Weekday }
				selectedDays={ this.selectedDays }
				disabledDays={ this.props.disabledDays }
				onDayClick={ this.handleDayClick }
				enableOutsideDays
				/>
		);
	}
}
