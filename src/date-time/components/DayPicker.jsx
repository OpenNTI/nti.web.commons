import './DayPicker.scss';
import React from 'react';
import PropTypes from 'prop-types';
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
		disabledDays: PropTypes.func,
		selectedDays: PropTypes.arrayOf(PropTypes.object),
		initialMonth: PropTypes.object
	}


	static defaultProps = {
		value: null
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


	componentDidUpdate ({value: oldValue}) {
		const {value} = this.props;
		if (oldValue !== value) {
			this.setState({ value });
		}
	}


	getValue (props = this.props) {
		return props.value || this.state.value;
	}

	/**
	 * Handles a day being clicked
	 * @param  {Date} day - This is the day that was clicked.
	 * @param  {object} modifiers - Modifiers from react-day-picker
	 * @param  {boolean} modifiers.selected - This is true if the day clicked is currently selected.
	 * @param  {boolean} modifiers.disabled - This is true if the day is disabled.
	 * @param  {event} e - Click event.
	 * @return {void}
	 */
	handleDayClick (day, { selected, disabled }, e) {
		const {onChange} = this.props;

		e.preventDefault();

		if (disabled || day == null) { return; }

		// Default the time to 12:00 AM per Design
		day.setHours(0);
		day.setMinutes(0);

		if(onChange) {
			onChange(day);
		}

		this.setState({
			value: day
		});
	}


	render () {
		const {initialMonth, selectedDays, ...otherProps} = this.props;
		const {value} = this.state;
		return (
			<Picker
				{...otherProps}
				weekdayElement={ <Weekday/> }
				initialMonth={ initialMonth || value || void value }
				// month={value || void value }
				selectedDays={ selectedDays || this.selectedDays }
				onDayClick={ this.handleDayClick }
				enableOutsideDays
			/>
		);
	}
}
