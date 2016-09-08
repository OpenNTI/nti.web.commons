import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

import Select from '../Select';
import TimePicker from '../TimePicker';

const MONTHS = [
		{longLabel: 'January', shortLabel: 'JAN', value: 0, days: 31},
		{longLabel: 'February', shortLabel: 'FEB', value: 1, days: 28, leapDays: 29},
		{longLabel: 'March', shortLabel: 'MAR', value: 2, days: 31},
		{longLabel: 'April', shortLabel: 'APR', value: 3, days: 30},
		{longLabel: 'May', shortLabel: 'MAY', value: 4, days: 31},
		{longLabel: 'June', shortLabel: 'JUN', value: 5, days: 30},
		{longLabel: 'July', shortLabel: 'JUL', value: 6, days: 31},
		{longLabel: 'August', shortLabel: 'AUG', value: 7, days: 31},
		{longLabel: 'September', shortLabel: 'SEP', value: 8, days: 30},
		{longLabel: 'October', shortLabel: 'OCT', value: 9, days: 31},
		{longLabel: 'November', shortLabel: 'NOV', value: 10, days: 30},
		{longLabel: 'December', shortLabel: 'DEC', value: 11, days: 31}
];


const isLeapYear = (y) => ((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0);


export default class DataTimeField extends Component {
	static propTypes = {
		value: PropTypes.instanceOf(Date),
		onChange: PropTypes.func.isRequired,
		currentDate: PropTypes.bool,
		useShortDates: PropTypes.bool,
		error: PropTypes.string,
		disabled: PropTypes.bool
	}

	onDateChange = (value, method) => {
		const {onChange, value: oldDate} = this.props;
		let date;
		if (oldDate) {
			date = new Date(oldDate);
		} else {
			date = new Date();
			date.setDate(1);
		}

		date[method](value);

		onChange(date);
	}


	onTimePickerChange = (value) => {
		const {onChange} = this.props;

		onChange(value);
	}


	onMonthChange = ({target}) => {
		const {value} = target;
		this.onDateChange(value, 'setMonth');
	}


	onDayChange = ({target}) => {
		const {value} = target;
		this.onDateChange(value, 'setDate');
	}


	onYearChange = ({target}) => {
		const {value} = target;
		this.onDateChange(value, 'setYear');
	}


	setCurrentDate = () => {
		const {onChange} = this.props;

		onChange(new Date());
	}

	renderDays ({days = 31, value, leapDays = void 0}, year) {
		const daysArray = [];

		// Check for Leap Year
		if(isLeapYear(year || new Date().getFullYear()) && value === 1) {
			days = leapDays;
		}

		for(let i = 1; i <= days; i++) {
			daysArray.push(<option key={i} value={i}>{i}</option>);
		}
		return daysArray;
	}


	renderYears () {
		const years = [];
		const now = new Date();
		for(let i = now.getFullYear(); i < now.getFullYear() + 6; i++) {
			years.push(<option key={i} value={i}>{i}</option>);
		}
		return years;
	}


	render () {
		const {value, error, useShortDates, currentDate, disabled} = this.props;

		const componentClassNames = cx('date-time-field-component', {disabled: disabled});

		return (
			<div className={componentClassNames}>
				<div className="date-time-wrapper">
					<div className="date-label-wrapper">
						<label className="date-select-label">MONTH</label>
						<label className="date-select-label">DAY</label>
						<label className="date-select-label">YEAR</label>
					</div>
					<div className="month-wrapper">
						<Select label="MONTH" value={value && value.getMonth()} empty onChange={this.onMonthChange}>
							{MONTHS.map(month => <option key={month.value} value={month.value}>{useShortDates ? month.shortLabel : month.longLabel}</option>)}
						</Select>
					</div>
					<div className="date-wrapper">
						<Select label="DAY" value={value && value.getDate()} empty onChange={this.onDayChange}>
							{value ? this.renderDays(MONTHS[value.getMonth()], value.getYear()) : this.renderDays({})}
						</Select>
					</div>
					<div className="year-wrapper">
						<Select label="YEAR" value={value && value.getFullYear()} empty onChange={this.onYearChange}>
							{this.renderYears()}
						</Select>
					</div>
				</div>
				<TimePicker value={value} allowEmpty onChange={this.onTimePickerChange} />
				{currentDate && <div className="set-current-date">or <a onClick={this.setCurrentDate}>Current Date/Time</a></div>}
				{(error) && <div className="date-time-field-error">{error}</div>}
			</div>
		);
	}
}
