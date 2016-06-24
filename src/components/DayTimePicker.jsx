import React, {PropTypes} from 'react';

import DayPicker, {DateUtils} from './DayPicker';
import TimePicker from './TimePicker';

export default class DayTimePicker extends React.Component {
	static propTypes = {
		value: React.PropTypes.instanceOf(Date),
		onChange: PropTypes.func
	}

	onDateChange = (date) => {
		const {onChange} = this.props;

		if (DateUtils.isPastDay(date)) {
			let today = new Date();
			today.setHours(date.getHours(), date.getMinutes(), 0, 0);
			date = today;
		}

		if(onChange) {
			onChange(date);
		}
	}


	render () {
		const {value} = this.props;

		return (
			<div className="daytime-picker">
				<DayPicker
					value={value}
					disabledDays={DateUtils.isPastDay}
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
