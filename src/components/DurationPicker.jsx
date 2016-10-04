import React from 'react';
import {scoped} from 'nti-lib-locale';

import NumberInput from './NumberInput';

export const secondsPerHour = 3600;
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
	}
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
 * Get a display string for the duration of a given number of
 * seconds
 * @param  {Number} seconds the number of seconds
 * @return {String}       display value
 */
function getDisplay (seconds) {
	const days = getDays(seconds);
	const hours = getHours(seconds);
	const minutes = getMinutes(seconds);

	const p = (val, unit) => val ? t(unit, {count:val}) : '';

	return `${p(days, 'days')} ${p(hours, 'hours')} ${p(minutes, 'minutes')}`;
}


export default class DurationPicker extends React.Component {
	constructor (props) {
		super(props);

		this.state = {};
		this.inputChanged = this.inputChanged.bind(this);
		this.getValue = this.getValue.bind(this);
	}

	static propTypes = {
		onChange: React.PropTypes.func,
		value: React.PropTypes.number
	}


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

	componentWillMount () {
		const {value = 0} = this.props;
		this.setState({value});
	}

	componentDidMount () {
		// this.hours.focus();
	}

	getValue () {
		const days = this.days.value;
		const hours = this.hours.value;
		const minutes = this.minutes.value;
		return Math.max(0, (days * secondsPerDay) + (hours * secondsPerHour) + (minutes * 60));
	}

	inputChanged () {

		const value = this.getValue();

		this.setState({value});

		if (typeof this.props.onChange === 'function') {
			this.props.onChange(value);
		}
	}

	render () {

		const {value} = this.state;
		const days = this.constructor.days(value);
		const hours = this.constructor.hours(value);
		const minutes = this.constructor.minutes(value);

		return (
			<div className="duration-picker">
				<label>
					<span className="label">Days</span>
					<NumberInput ref={x => this.days = x}
						type="number"
						onChange={this.inputChanged}
						defaultValue={days}
						min="0"
					/>
				</label>
				<label>
					<span className="label">Hours</span>
					<NumberInput ref={x => this.hours = x}
						type="number"
						onChange={this.inputChanged}
						defaultValue={hours}
						min={0} max={23}
					/>
				</label>
				<label>
					<span className="label">Minutes</span>
					<NumberInput ref={x => this.minutes = x}
						type="number"
						onChange={this.inputChanged}
						defaultValue={minutes}
						min="0"
						max="59"
					/>
				</label>
			</div>
		);
	}
}
