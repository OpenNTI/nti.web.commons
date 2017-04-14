import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

import {Number as NumberInput} from './inputs';

export const secondsPerMinute = 60;
export const secondsPerHour = secondsPerMinute * 60;
export const secondsPerDay = secondsPerHour * 24;

const DEFAULT_TEXT = {
	days: {
		one: '%(count)s Day',
		other: '%(count)s Days'
	},
	hours: {
		one: '%(count)s Hour',
		other: '%(count)s Hours'
	},
	minutes: {
		one: '%(count)s Minute',
		other: '%(count)s Minutes'
	},
	daysLabel: 'Days',
	hoursLabel: 'Hours',
	minutesLabel: 'Minutes'
};

const t = scoped('DURATION_UNITS', DEFAULT_TEXT);


/**
 * Get the minutes (0-59) for the given seconds value.
 * @param  {number} seconds number of seconds
 * @return {integer} the minutes (0-59) for the given seconds value
 */
function getMinutes (seconds) {
	return Math.floor((seconds % secondsPerHour) / 60);
}


/**
 * Get the hours (0-23) for the given seconds value
 * @param  {number} seconds The number of seconds
 * @return {integer} the number of hours (0-23) for the given seconds value
 */
function getHours (seconds) {
	return Math.floor((seconds % secondsPerDay) / secondsPerHour);
}


/**
 * Get the number of days for the given seconds value
 * @param  {number} seconds The number of seconds
 * @return {integer} the number of days for the given seconds value
 */
function getDays (seconds) {
	return Math.floor(seconds / secondsPerDay);
}

/**
 * Get the number of seconds for the given days, hours, and minutes
 * @param  {Number} days    number of days
 * @param  {Number} hours   number of hours
 * @param  {Number} minutes number of minutes
 * @return {Number}         number of seconds
 */
function getValue (days, hours, minutes) {
	return Math.max(0, (days * secondsPerDay) + (hours * secondsPerHour) + (minutes * secondsPerMinute));
}

/**
 * Get a display string for the duration of a given number of
 * seconds
 * @param  {Number} seconds the number of seconds
 * @return {String}       display value
 */
export function getDisplay (seconds) {
	const days = getDays(seconds);
	const hours = getHours(seconds);
	const minutes = getMinutes(seconds);

	const p = (val, unit) => val ? t(unit, {count:val}) : '';

	return `${p(days, 'days')} ${p(hours, 'hours')} ${p(minutes, 'minutes')}`;
}


export default class DurationPicker extends React.Component {
	static minutes (seconds) {
		return getMinutes(seconds);
	}

	static hours (seconds) {
		return getHours(seconds);
	}

	static days (seconds) {
		return getDays(seconds);
	}

	static getDisplay (value) {
		return getDisplay(value);
	}


	static propTypes = {
		value: PropTypes.number,//the duration in seconds
		onChange: PropTypes.func
	}

	constructor (props) {
		super(props);

		const {value} = props;

		this.state = {
			days: getDays(value),
			hours: getHours(value),
			minutes: getMinutes(value)
		};
	}

	componentWillReceiveProps (nextProps) {
		const {value:nextValue} = nextProps;
		const {value:oldValue} = this.props;

		if (nextValue !== oldValue) {
			this.setState({
				days: getDays(nextValue),
				hours: getHours(nextValue),
				minutes: getMinutes(nextValue)
			});
		}
	}


	onChange (days, hours, minutes) {
		const {value:oldValue, onChange} = this.props;
		const newValue = getValue(days, hours, minutes);

		if (newValue !== oldValue && onChange) {
			onChange(newValue);
		}
	}


	onDaysChanged = (days) => {
		const {hours, minutes} = this.state;

		this.onChange(days, hours, minutes);
	}


	onHoursChanged = (hours) => {
		const {days, minutes} = this.state;

		this.onChange(days, hours, minutes);
	}


	onMinutesChanged = (minutes) => {
		const {days, hours} = this.state;

		this.onChange(days, hours, minutes);
	}

	render () {
		const {days, hours, minutes} = this.state;

		return (
			<div className="duration-picker">
				<NumberInput onChange={this.onDaysChanged} value={days} label={t('daysLabel')} />
				<NumberInput onChange={this.onHoursChanged} value={hours} label={t('hoursLabel')} />
				<NumberInput onChange={this.onMinutesChanged} value={minutes} label={t('minutesLabel')} />
			</div>
		);
	}
}
