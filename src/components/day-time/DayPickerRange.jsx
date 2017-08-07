import React from 'react';
import PropTypes from 'prop-types';
import { DateUtils } from 'react-day-picker';

import DateTime from '../DateTime';

import DayPicker from './DayPicker';

export {DateUtils};

export default class DayPickerRange extends React.Component {
	static propTypes = {
		value: PropTypes.object,
		onChange: PropTypes.func,
		disabledDays: PropTypes.func,
		startDate: PropTypes.object,
		endDate: PropTypes.object,
		updateStartDate: PropTypes.func,
		updateEndDate: PropTypes.func
	}


	static defaultProps = {
		value: null
	}


	constructor (props) {
		super(props);
		const {value} = props;

		this.state = {
			value,
			selectedType: 'Start'
		};

		this.handleDayClick = this.handleDayClick.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		if (nextProps.value !== this.props.value) {
			this.setState({
				value: nextProps.value
			});
		}
	}


	getValue (props = this.props) {
		return props.value || this.state.value;
	}

	/**
	 * Handles a day being clicked
	 * @param  {Date} value - This is the day that was clicked.
	 * @param  {object} modifiers - Modifiers from react-day-picker
	 * @param  {boolean} modifiers.selected - This is true if the day clicked is currently selected.
	 * @param  {boolean} modifiers.disabled - This is true if the day is disabled.
	 * @param  {event} e - Click event.
	 * @return {void}
	 */
	handleDayClick (value) {
		const { selectedType } = this.state;
		const { updateStartDate, updateEndDate } = this.props;

		if(selectedType === 'Start' && DateUtils.isDayAfter(value, this.props.endDate)) {
			return;
		}

		if(selectedType === 'End' && DateUtils.isDayBefore(value, this.props.startDate)) {
			return;
		}

		if(selectedType === 'Start' && updateStartDate) {
			updateStartDate(value);
		}
		else if(selectedType === 'End' && updateEndDate) {
			updateEndDate(value);
		}
	}

	renderDate (type, date) {
		const onSelect = () => {
			this.setState({selectedType: type});
		};

		let className = 'date';

		if(this.state.selectedType === type) {
			className += ' selected';
		}

		return (<div className={className} onClick={onSelect}>
			<div className="label">{type}</div>
			<div className="value">{DateTime.format(date, 'MMM. D')}</div>
		</div>);
	}

	getDateValue () {
		if(this.state.selectedType === 'Start') {
			return this.props.startDate;
		}
		else {
			return this.props.endDate;
		}
	}

	render () {
		const { startDate, endDate } = this.props;
		const modifiers = DateUtils.isSameDay(startDate, endDate)
			? {
				rangeonly: startDate
			} :
			{
				rangeopen: startDate,
				rangeclose: endDate
			};

		const selectedDays = [
			startDate,
			{
				from: startDate,
				to: endDate
			}
		];

		const value = this.state.selectedType === 'Start' ? startDate : endDate;
		return (
			<div className="date-picker-range">
				<div className="course-panel-choosedates">
					<div className="selected-dates">
						{this.renderDate('Start', this.props.startDate)}
						{this.renderDate('End', this.props.endDate)}
					</div>
				</div>
				<DayPicker
					initialMonth={ value || void value }
					month={value || void value }
					selectedDays={ selectedDays }
					disabledDays={ this.props.disabledDays }
					onChange={ this.handleDayClick }
					modifiers={ modifiers }
					enableOutsideDays
				/>
			</div>
		);
	}
}
