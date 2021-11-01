import './DayPickerRange.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { DateUtils } from 'react-day-picker';

import Date from './Date';
import DayPicker from './DayPicker';

export { DateUtils };

export default class DayPickerRange extends React.Component {
	static propTypes = {
		value: PropTypes.object,
		onChange: PropTypes.func,
		disabledDays: PropTypes.func,
		startDate: PropTypes.object,
		endDate: PropTypes.object,
		updateStartDate: PropTypes.func,
		updateEndDate: PropTypes.func,
	};

	static defaultProps = {
		value: null,
	};

	constructor(props) {
		super(props);
		const { value } = props;

		this.state = {
			value,
			selectedType: 'Start',
		};
	}

	componentDidUpdate({ value: oldValue }) {
		const { value } = this.props;
		if (oldValue !== value) {
			this.setState({
				value,
			});
		}
	}

	getValue(props = this.props) {
		return props.value || this.state.value;
	}

	/**
	 * @param  {Date} value - The day that was clicked
	 * @returns {void}
	 */
	handleDayClick = value => {
		const { selectedType } = this.state;
		const { updateStartDate, updateEndDate, startDate, endDate } =
			this.props;

		if (
			selectedType === 'Start' &&
			endDate &&
			DateUtils.isDayAfter(value, endDate)
		) {
			return;
		}

		if (
			selectedType === 'End' &&
			startDate &&
			DateUtils.isDayBefore(value, startDate)
		) {
			return;
		}

		if (selectedType === 'Start' && updateStartDate) {
			updateStartDate(value);
		} else if (selectedType === 'End' && updateEndDate) {
			updateEndDate(value);
		}
	};

	onDateRemove = type => {
		const { updateStartDate, updateEndDate } = this.props;

		if (type === 'Start') {
			updateStartDate && updateStartDate();
		} else {
			updateEndDate && updateEndDate();
		}
	};

	onDateSelect = type => {
		this.setState({ selectedType: type });
	};

	getDateValue() {
		if (this.state.selectedType === 'Start') {
			return this.props.startDate;
		} else {
			return this.props.endDate;
		}
	}

	render() {
		const { startDate, endDate, disabledDays } = this.props;

		let modifiers = null,
			selectedDays = null;

		if (startDate && endDate) {
			modifiers = DateUtils.isSameDay(startDate, endDate)
				? {
						rangeonly: startDate,
				  }
				: {
						rangeopen: startDate,
						rangeclose: endDate,
				  };

			selectedDays = [
				startDate,
				{
					from: startDate,
					to: endDate,
				},
			];
		}

		const value = this.state.selectedType === 'Start' ? startDate : endDate;
		return (
			<div className="date-picker-range">
				<div className="course-panel-choosedates">
					<div className="selected-dates">
						<Date
							date={startDate}
							type="Start"
							onSelect={this.onDateSelect}
							onRemove={this.onDateRemove}
							selected={this.state.selectedType === 'Start'}
						/>
						<Date
							date={endDate}
							type="End"
							onSelect={this.onDateSelect}
							onRemove={this.onDateRemove}
							selected={this.state.selectedType === 'End'}
						/>
					</div>
				</div>
				<DayPicker
					initialMonth={value || void value}
					month={value || void value}
					selectedDays={selectedDays}
					disabledDays={disabledDays}
					onChange={this.handleDayClick}
					modifiers={modifiers}
					enableOutsideDays
				/>
			</div>
		);
	}
}
