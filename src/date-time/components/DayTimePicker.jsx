import './DayTimePicker.scss';
import React from 'react';
import PropTypes from 'prop-types';

import DayPicker, { DateUtils } from './DayPicker';
import TimePicker from './TimePicker';

export default class DayTimePicker extends React.Component {
	static propTypes = {
		value: PropTypes.instanceOf(Date),
		onChange: PropTypes.func,
		disabledDays: PropTypes.func,
		disablePastNow: PropTypes.bool,
		retainTime: PropTypes.bool, // when selecting a new day, specify whether to keep the old day's time on the newly selected date
	};

	static defaultProps = {
		disabledDays: DateUtils.isPastDay,
		disablePastNow: false,
	};

	onDateValueChange = date => {
		const { value, retainTime } = this.props;

		let newDate = date;

		if (retainTime && value && value.getHours && value.getMinutes) {
			newDate = new Date(
				date.getFullYear(),
				date.getMonth(),
				date.getDate(),
				value.getHours(),
				value.getMinutes(),
				0
			);
		}

		this.onDateChange(newDate, false);
	};

	onTimeChange = date => {
		this.onDateChange(date, true);
	};

	onDateChange(date, timeChanged) {
		const { onChange, disablePastNow } = this.props;

		if (DateUtils.isPastDay(date) && disablePastNow) {
			let today = new Date();
			today.setHours(date.getHours(), date.getMinutes(), 0, 0);
			date = today;
		}

		if (onChange) {
			onChange(date, timeChanged);
		}
	}

	render() {
		const { value, disabledDays } = this.props;

		return (
			<div className="daytime-picker">
				<DayPicker
					value={value}
					disabledDays={disabledDays}
					onChange={this.onDateValueChange}
				/>
				<div className="time-picker-header-text">YOUR LOCAL TIME</div>
				<TimePicker value={value} onChange={this.onTimeChange} />
			</div>
		);
	}
}
