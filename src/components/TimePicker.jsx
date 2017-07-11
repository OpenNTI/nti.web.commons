import React from 'react';
import PropTypes from 'prop-types';
import {Time} from 'nti-commons';

import SelectBox from './SelectBox';
import {Number as NumberInput} from './inputs';

const getNumber = n => (n = parseInt(n, 10), isNaN(n) ? null : n);
const TimeMap = new WeakMap();
const isValidHour = h => h < 24 ? true : false;
const MAX_MINUTES = 59;
const MIN_MINUTES = 0;


export default class TimePicker extends React.Component {

	static propTypes = {
		value: PropTypes.object,
		onChange: PropTypes.func,
		allowEmpty: PropTypes.bool
	}

	constructor (props) {
		super(props);

		this.state = {
			value: this.getValue(),
			tfTime: false,
			editingHour: false
		};

		this.onChange = value => {
			const {onChange} = this.props;
			if (onChange) {
				onChange(value.date);
			}

			this.setState({value});
		};
	}


	/**
	 * A private utility method to abstract where we get "value" from and to normalize it into
	 * a Time instance. Use this to get the current value when rendering, or reasoning about
	 * the current value. DO NOT, I REPEAT, DO NOT reference `value` in props or state directly!!!
	 *
	 * The value in state is ONLY used if the value prop is not given. If the value prop is given,
	 * we do NOT internally track the value. We give it to the parent through "onChange" and let it
	 * pass it back in a prop update.
	 *
	 * @param  {boolean} force - Use this to force value to an new date.
	 * @param  {Object} props - defaults to {this.props}. The props to base the value off of.
	 * @return {Time} - an instance of Time.
	 */
	getValue (force, props = this.props) {
		let {value, allowEmpty} = props;

		let time = value && TimeMap.get(value);
		if (value && !time) {
			TimeMap.set(value, time = new Time(value));
		}

		return time || (this.state || {}).value || ((allowEmpty && !force) ? void 0 : new Time());
	}

	componentWillReceiveProps (nextProps) {
		if(nextProps.value !== this.props.value) {
			this.setState({
				value: this.getValue(false, nextProps)
			});
		}
	}


	onHourInputChange = (hours) => {
		const {tfTime} = this.state;
		const value = this.getValue(true);

		if(!isValidHour(getNumber(hours))) { return; }

		if (hours == null) {
			//reset
			this.setState({
				tfTime: false,
				editingHour: true
			});
		} else if (hours === 0 || hours > 12) {
			//turn on 24hour
			this.setState({
				tfTime: true,
				editingHour: false
			});
		} else if (!tfTime) {
			hours = this.convertHours(hours);
			this.setState({
				editingHour: false
			});
		}

		this.onChange(value.setHours(hours));
	}


	onMinuteInputChange = (minutes) => {
		const value = this.getValue(true);

		if(minutes >= MIN_MINUTES && minutes <= MAX_MINUTES || minutes === null) {
			this.onChange(value.setMinutes(getNumber(minutes)));
		}
	}


	onMeridiemChange = (period) => {
		const value = this.getValue(true);
		this.onChange(value.setPeriod(period));
	}


	convertHours (h) {
		const value = this.getValue(true);
		const period = value && value.getPeriod();

		if (!value) { return; }

		if(period === 'AM' && h === 12) {
			return 0;
		} else if (period === 'PM' && h !== 12) {
			return h + 12;
		}
		return h;
	}


	renderMeridiem () {
		const meridiemOptions = [
			{label: 'AM', value: 'AM'},
			{label: 'PM', value: 'PM'}
		];
		const {tfTime} = this.state;
		const value = this.getValue();
		const meridiem = !value ? meridiemOptions[0].value : value.getPeriod();

		return (
			<SelectBox className="meridiem-select-box" disabled={tfTime} value={meridiem} options={meridiemOptions} onChange={this.onMeridiemChange}/>
		);
	}


	onHourInputBlur = () => {
		this.setState({
			editingHour: false
		});
	}


	onHourIncrement = () => {
		const value = this.getValue(true);

		this.onChange(value.incrementHours());
	}


	onHourDecrement = () => {
		const value = this.getValue(true);

		this.onChange(value.decrementHours());
	}


	onMinuteIncrement = () => {
		const value = this.getValue(true);

		this.onChange(value.incrementMinutes());
	}


	onMinuteDecrement = () => {
		const value = this.getValue(true);

		this.onChange(value.decrementMinutes());
	}


	render () {
		const {tfTime, editingHour} = this.state;
		const {allowEmpty} = this.props;
		const value = this.getValue();

		let hours = !value ? '' : (tfTime ? value.getHours() : ((value.getHours() % 12) || 12));
		const minutes = !value ? '' : value.getMinutes();

		// Allow to edit the hours. Can't type down to zero because we are using a date.
		if (editingHour) { hours = ''; }

		return (
			<div className="TimePicker">
				<div className="time">
					<NumberInput
						onChange={this.onHourInputChange}
						onBlur={this.onHourInputBlur}
						onIncrement={this.onHourIncrement}
						onDecrement={this.onHourDecrement}
						value={hours}
						name="hours"
						min={0} max={23}
					/>
					<span> : </span>
					<NumberInput
						onChange={this.onMinuteInputChange}
						onIncrement={this.onMinuteIncrement}
						onDecrement={this.onMinuteDecrement}
						value={minutes}
						name="minutes"
						min={0} max={59}
						pad={!allowEmpty || value != null}
					/>
				</div>
				{this.renderMeridiem()}
			</div>
		);
	}
}
