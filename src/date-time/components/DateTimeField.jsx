import './DateTimeField.scss';
import { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Select from '../../components/Select';

import TimePicker from './TimePicker';

const MONTHS = [
	{ longLabel: 'January', shortLabel: 'JAN', value: 0, days: 31 },
	{
		longLabel: 'February',
		shortLabel: 'FEB',
		value: 1,
		days: 28,
		leapDays: 29,
	},
	{ longLabel: 'March', shortLabel: 'MAR', value: 2, days: 31 },
	{ longLabel: 'April', shortLabel: 'APR', value: 3, days: 30 },
	{ longLabel: 'May', shortLabel: 'MAY', value: 4, days: 31 },
	{ longLabel: 'June', shortLabel: 'JUN', value: 5, days: 30 },
	{ longLabel: 'July', shortLabel: 'JUL', value: 6, days: 31 },
	{ longLabel: 'August', shortLabel: 'AUG', value: 7, days: 31 },
	{ longLabel: 'September', shortLabel: 'SEP', value: 8, days: 30 },
	{ longLabel: 'October', shortLabel: 'OCT', value: 9, days: 31 },
	{ longLabel: 'November', shortLabel: 'NOV', value: 10, days: 30 },
	{ longLabel: 'December', shortLabel: 'DEC', value: 11, days: 31 },
];

const isLeapYear = y => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

export default class DateTimeField extends Component {
	static propTypes = {
		value: PropTypes.instanceOf(Date),
		onChange: PropTypes.func.isRequired,
		currentDate: PropTypes.bool,
		useShortDates: PropTypes.bool,
		error: PropTypes.string,
		disabled: PropTypes.bool,
		defaultTime: PropTypes.instanceOf(Date),
		startYear: PropTypes.number,
		numYears: PropTypes.number,
	};

	onDateChange = (value, method) => {
		const { onChange, value: oldDate, defaultTime = void 0 } = this.props;
		let date;

		if (oldDate) {
			date = new Date(oldDate);
		} else {
			const defaultHours = defaultTime ? defaultTime.getHours() : 23;
			const defaultMinutes = defaultTime ? defaultTime.getMinutes() : 59;
			date = new Date();

			date.setDate(1);
			date.setHours(defaultHours);
			date.setMinutes(defaultMinutes);
		}

		date[method](value);

		onChange(date);
	};

	onTimePickerChange = value => {
		const { onChange } = this.props;

		onChange(value);
	};

	onMonthChange = ({ target }) => {
		const { value } = target;
		this.onDateChange(value, 'setMonth');
	};

	onDayChange = ({ target }) => {
		const { value } = target;
		this.onDateChange(value, 'setDate');
	};

	onYearChange = ({ target }) => {
		const { value } = target;
		this.onDateChange(value, 'setYear');
	};

	setCurrentDate = () => {
		const { onChange } = this.props;

		onChange(new Date());
	};

	renderDays({ days = 31, value, leapDays = void 0 }, year) {
		// Check for Leap Year
		if (isLeapYear(year || new Date().getFullYear()) && value === 1) {
			days = leapDays;
		}

		return Array.from({ length: days }).map((_, i) => (
			<option key={i} value={i + 1}>
				{i + 1}
			</option>
		));
	}

	renderYears() {
		const {
			startYear = new Date().getFullYear(),
			numYears = 6,
			value,
		} = this.props;
		const years = Array.from({ length: numYears }).map(
			(_, i) => startYear + i
		);
		const valueYear =
			value && value.getFullYear ? value.getFullYear() : null;

		if (valueYear && valueYear > startYear + numYears) {
			years.push(valueYear);
		}

		if (valueYear && valueYear < startYear) {
			years.unshift(valueYear);
		}

		return years.map(year => (
			<option key={year} value={year}>
				{year}
			</option>
		));
	}

	render() {
		const {
			value,
			error,
			useShortDates,
			currentDate,
			disabled,
		} = this.props;

		const componentClassNames = cx('date-time-field-component', {
			disabled: disabled,
		});

		return (
			<div className={componentClassNames}>
				<div className="date-time-wrapper">
					<div className="date-label-wrapper">
						<label className="date-select-label">MONTH</label>
						<label className="date-select-label">DAY</label>
						<label className="date-select-label">YEAR</label>
					</div>
					<div className="month-wrapper">
						<Select
							label="MONTH"
							value={value && value.getMonth()}
							empty
							onChange={this.onMonthChange}
						>
							{MONTHS.map(month => (
								<option key={month.value} value={month.value}>
									{useShortDates
										? month.shortLabel
										: month.longLabel}
								</option>
							))}
						</Select>
					</div>
					<div className="date-wrapper">
						<Select
							label="DAY"
							value={value && value.getDate()}
							empty
							onChange={this.onDayChange}
						>
							{value
								? this.renderDays(
										MONTHS[value.getMonth()],
										value.getYear()
								  )
								: this.renderDays({})}
						</Select>
					</div>
					<div className="year-wrapper">
						<Select
							label="YEAR"
							value={value && value.getFullYear()}
							empty
							onChange={this.onYearChange}
						>
							{this.renderYears()}
						</Select>
					</div>
				</div>
				<TimePicker
					value={value}
					allowEmpty
					onChange={this.onTimePickerChange}
				/>
				{currentDate && (
					<div className="set-current-date">
						or{' '}
						<a onClick={this.setCurrentDate}>Current Date/Time</a>
					</div>
				)}
				{error && <div className="date-time-field-error">{error}</div>}
			</div>
		);
	}
}
