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
	handleDayClick = (value) => {
		const { selectedType } = this.state;
		const { updateStartDate, updateEndDate, startDate, endDate } = this.props;

		if(selectedType === 'Start' && endDate && DateUtils.isDayAfter(value, endDate)) {
			return;
		}

		if(selectedType === 'End' && startDate && DateUtils.isDayBefore(value, startDate)) {
			return;
		}

		if(selectedType === 'Start' && updateStartDate) {
			updateStartDate(value);
		}
		else if(selectedType === 'End' && updateEndDate) {
			updateEndDate(value);
		}
	}

	renderRemoveButton (type, date) {
		if(!date) {
			return null;
		}

		const removeDate = () => {
			const { updateStartDate, updateEndDate } = this.props;

			if(type === 'Start') {
				updateStartDate && updateStartDate();
			}
			else {
				updateEndDate && updateEndDate();
			}
		};

		return (<div className="remove-date" onClick={removeDate}><i className="icon-light-x"/></div>);
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
			<div className="field-contents">
				<div className="label">{type}</div>
				<div className="value">{date ? DateTime.format(date, 'MMM. D') : ''}</div>
			</div>
			{this.renderRemoveButton(type, date)}
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
		const { startDate, endDate, disabledDays } = this.props;

		let modifiers = null, selectedDays = null;

		if(startDate && endDate) {
			modifiers = DateUtils.isSameDay(startDate, endDate)
				? {
					rangeonly: startDate
				} :
				{
					rangeopen: startDate,
					rangeclose: endDate
				};

			selectedDays = [
				startDate,
				{
					from: startDate,
					to: endDate
				}
			];
		}

		const value = this.state.selectedType === 'Start' ? startDate : endDate;
		return (
			<div className="date-picker-range">
				<div className="course-panel-choosedates">
					<div className="selected-dates">
						{this.renderDate('Start', startDate)}
						{this.renderDate('End', endDate)}
					</div>
				</div>
				<DayPicker
					initialMonth={ value || void value }
					month={value || void value }
					selectedDays={ selectedDays }
					disabledDays={ disabledDays }
					onChange={ this.handleDayClick }
					modifiers={ modifiers }
					enableOutsideDays
				/>
			</div>
		);
	}
}
