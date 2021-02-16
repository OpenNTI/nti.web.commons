import './DurationPicker.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

import { Number as NumberInput, Label } from './inputs';

export const secondsPerMinute = 60;
export const secondsPerHour = secondsPerMinute * 60;
export const secondsPerDay = secondsPerHour * 24;

const DEFAULT_TEXT = {
	days: {
		one: '%(count)s Day',
		other: '%(count)s Days',
	},
	hours: {
		one: '%(count)s Hour',
		other: '%(count)s Hours',
	},
	minutes: {
		one: '%(count)s Minute',
		other: '%(count)s Minutes',
	},
	daysLabel: 'Days',
	hoursLabel: 'Hours',
	minutesLabel: 'Minutes',
};

const t = scoped('common.components.durations.units', DEFAULT_TEXT);

/**
 * Get the minutes (0-59) for the given seconds value.
 * @param  {number} seconds number of seconds
 * @returns {integer} the minutes (0-59) for the given seconds value
 */
function getMinutes(seconds) {
	return Math.floor((seconds % secondsPerHour) / 60);
}

/**
 * Get the hours (0-23) for the given seconds value
 * @param  {number} seconds The number of seconds
 * @returns {integer} the number of hours (0-23) for the given seconds value
 */
function getHours(seconds) {
	return Math.floor((seconds % secondsPerDay) / secondsPerHour);
}

/**
 * Get the number of days for the given seconds value
 * @param  {number} seconds The number of seconds
 * @returns {integer} the number of days for the given seconds value
 */
function getDays(seconds) {
	return Math.floor(seconds / secondsPerDay);
}

/**
 * Get the number of seconds for the given days, hours, and minutes
 * @param  {number} days    number of days
 * @param  {number} hours   number of hours
 * @param  {number} minutes number of minutes
 * @returns {number}         number of seconds
 */
function getValue(days, hours, minutes) {
	return Math.max(
		0,
		days * secondsPerDay +
			hours * secondsPerHour +
			minutes * secondsPerMinute
	);
}

/**
 * Get a display string for the duration of a given number of
 * seconds
 * @param  {number} seconds the number of seconds
 * @returns {string}       display value
 */
export function getDisplay(seconds) {
	const days = getDays(seconds);
	const hours = getHours(seconds);
	const minutes = getMinutes(seconds);

	const p = (val, unit) => (val ? t(unit, { count: val }) : '');

	return `${p(days, 'days')} ${p(hours, 'hours')} ${p(minutes, 'minutes')}`;
}

export default class DurationPicker extends React.Component {
	static minutes(seconds) {
		return getMinutes(seconds);
	}

	static hours(seconds) {
		return getHours(seconds);
	}

	static days(seconds) {
		return getDays(seconds);
	}

	static getDisplay(value) {
		return getDisplay(value);
	}

	static propTypes = {
		value: PropTypes.number, //the duration in seconds
		onChange: PropTypes.func,
	};

	constructor(props) {
		super(props);

		const { value } = props;

		this.state = {
			days: getDays(value),
			hours: getHours(value),
			minutes: getMinutes(value),
		};
	}

	componentDidUpdate(prevProps) {
		const { value: newValue } = this.props;
		const { value: oldValue } = prevProps;

		if (newValue !== oldValue) {
			this.setState({
				days: getDays(newValue),
				hours: getHours(newValue),
				minutes: getMinutes(newValue),
			});
		}
	}

	onChange(days, hours, minutes) {
		const { value: oldValue, onChange } = this.props;
		const newValue = getValue(days, hours, minutes);

		if (newValue !== oldValue && onChange) {
			onChange(newValue);
		}
	}

	onDaysChanged = days => {
		const { hours, minutes } = this.state;

		this.onChange(days, hours, minutes);
	};

	onHoursChanged = hours => {
		const { days, minutes } = this.state;

		this.onChange(days, hours, minutes);
	};

	onMinutesChanged = minutes => {
		const { days, hours } = this.state;

		this.onChange(days, hours, minutes);
	};

	onHoursIncrement = () => {
		const { days, hours, minutes } = this.state;
		let newHours = hours + 1;
		let newDays = days;

		if (newHours >= 24) {
			newDays += 1;
			newHours = 0;
		}

		this.onChange(newDays, newHours, minutes);
	};

	onHoursDecrement = () => {
		const { days, hours, minutes } = this.state;
		let newHours = hours - 1;
		let newDays = days;

		if (newHours < 0 && newDays >= 1) {
			newDays -= 1;
			newHours = 23;
		} else if (newHours < 0) {
			newHours = 0;
		}

		this.onChange(newDays, newHours, minutes);
	};

	onMinutesIncrement = () => {
		const { days, hours, minutes } = this.state;
		let newMinutes = minutes + 1;
		let newHours = hours;
		let newDays = days;

		if (newMinutes >= 60) {
			newHours += 1;
			newMinutes = 0;
		}

		if (newHours >= 24) {
			newDays += 1;
			newHours = 0;
		}

		this.onChange(newDays, newHours, newMinutes);
	};

	onMinutesDecrement = () => {
		const { days, hours, minutes } = this.state;
		let newMinutes = minutes - 1;
		let newHours = hours;
		let newDays = days;

		if (newMinutes < 0 && newHours > 0) {
			newHours -= 1;
			newMinutes = 59;
		} else if (newMinutes < 0 && newDays > 0) {
			newDays -= 1;
			newHours = 23;
			newMinutes = 59;
		} else if (newMinutes < 0) {
			newMinutes = 0;
		}

		this.onChange(newDays, newHours, newMinutes);
	};

	render() {
		const { days, hours, minutes } = this.state;

		return (
			<div className="duration-picker">
				<Label label={t('daysLabel')}>
					<NumberInput
						onChange={this.onDaysChanged}
						value={days}
						constrain
						min={0}
						max={1000000}
					/>
				</Label>

				<Label label={t('hoursLabel')}>
					<NumberInput
						onChange={this.onHoursChanged}
						value={hours}
						constrain
						min={0}
						max={23}
						onIncrement={this.onHoursIncrement}
						onDecrement={this.onHoursDecrement}
					/>
				</Label>

				<Label label={t('minutesLabel')}>
					<NumberInput
						onChange={this.onMinutesChanged}
						value={minutes}
						constrain
						min={0}
						max={59}
						onIncrement={this.onMinutesIncrement}
						onDecrement={this.onMinutesDecrement}
					/>
				</Label>
			</div>
		);
	}
}
