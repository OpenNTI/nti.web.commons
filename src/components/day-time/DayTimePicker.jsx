import React from 'react';
import PropTypes from 'prop-types';

import TimePicker from '../TimePicker';

import DayPicker, {DateUtils} from './DayPicker';

export default class DayTimePicker extends React.Component {
	static propTypes = {
		value: PropTypes.instanceOf(Date),
		onChange: PropTypes.func,
		disabledDays: PropTypes.func,
		disablePastNow: PropTypes.bool
	}

	static defaultProps = {
		disabledDays: DateUtils.isPastDay,
		disablePastNow: false
	}

	onDateChange = (date) => {
		const {onChange, disablePastNow} = this.props;

		if (DateUtils.isPastDay(date) && disablePastNow) {
			let today = new Date();
			today.setHours(date.getHours(), date.getMinutes(), 0, 0);
			date = today;
		}

		if(onChange) {
			onChange(date);
		}
	}


	render () {
		const {value, disabledDays} = this.props;

		return (
			<div className="daytime-picker">
				<DayPicker
					value={value}
					disabledDays={disabledDays}
					onChange={this.onDateChange}
				/>
				<div className="TimePicker-Header-Text">YOUR LOCAL TIME</div>
				<TimePicker
					value={value}
					onChange={this.onDateChange}
				/>
			</div>
		);
	}
}
