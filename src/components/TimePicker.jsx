import React, { PropTypes } from 'react';
import {Time} from 'nti-commons';

import SelectBox from './SelectBox';
import NumberInput from './NumberInput';

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


	onHourInputChange = (e) => {
		const {target: {value: hours}} = e;
		const {tfTime} = this.state;
		const value = this.getValue(true);

		if(!isValidHour(getNumber(hours))) { return; }

		let num = getNumber(hours);
		if (num == null) {
			//reset
			this.setState({
				tfTime: false,
				editingHour: hours === ''
			});
		} else if (num === 0 || num > 12) {
			//turn on 24hour
			this.setState({
				tfTime: true,
				editingHour: false
			});
		} else if (!tfTime) {
			num = this.convertHours(num);
			this.setState({
				editingHour: false
			});
		}

		this.onChange(value.setHours(num));
	}


	onMinuteInputChange = (e) => {
		const {target: {value: minuteString}} = e;
		const value = this.getValue(true);
		const minutes = getNumber(minuteString);

		if (!value) {
			e.stopPropagation();
			e.preventDefault();
			return;
		}

		if(minutes >= MIN_MINUTES && minutes <= MAX_MINUTES || minutes === null) {
			this.onChange(value.setMinutes(getNumber(minutes)));
		}
	}


	onMeridiemChange = (period) => {
		const value = this.getValue(true);
		this.onChange(value.setPeriod(period));
	}


	onKeyDown = (e) => {
		const {key, target: {name}} = e;
		const value = this.getValue(true);
		const KeyDownMap = {
			hoursArrowUp: 'incrementHours',
			hoursArrowDown: 'decrementHours',
			minutesArrowUp: 'incrementMinutes',
			minutesArrowDown: 'decrementMinutes'
		};

		const fn = KeyDownMap[name + key];

		if(fn) {
			e.stopPropagation();
			e.preventDefault();
			this.setState({
				editingHour: false
			});
			this.onChange(value[fn]());
		}
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
						onKeyDown={this.onKeyDown}
						onChange={this.onHourInputChange}
						onBlur={this.onHourInputBlur}
						value={hours}
						name="hours"
						min={0} max={23}
						/>
					<span> : </span>
					<NumberInput
						onKeyDown={this.onKeyDown}
						onChange={this.onMinuteInputChange}
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
