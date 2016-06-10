import React, { PropTypes } from 'react';
import SelectBox from './SelectBox';
import Time from 'nti-commons/lib/Time';
import autobind from 'nti-commons/lib/autobind';

const getNumber = n => (n = parseInt(n, 10), isNaN(n) ? null : n);
const TimeMap = new WeakMap();

export default class TimePicker extends React.Component {

	static propTypes = {
		value: PropTypes.object,
		onChange: PropTypes.func
	}

	constructor (props) {
		super(props);

		this.state = {
			value: this.getValue() || new Time(),
			tfTime: false,
			editingHour: false
		};

		autobind(this,'onKeyDown','onHourInputChange','onMinuteInputChange','onMeridiemChange', 'onHourInputBlur');

		this.onChange = value => {
			const {onChange} = this.props;
			if (onChange) {
				onChange(value.date);
			}

			this.setState({value});
		};
	}


	getValue (props = this.props) {
		const {value} = props;

		let time = value && TimeMap.get(value);
		if (value && !time) {
			TimeMap.set(value, time = new Time(value));
		}

		return time || this.state.value;
	}

	componentWillReceiveProps (nextProps) {
		if(nextProps.value !== this.props.value) {
			this.setState({
				value: this.getValue(nextProps)
			});
		}
	}

	onHourInputChange (e) {
		const {target: {value: hours}} = e;
		const {tfTime, value} = this.state;

		if(hours > 23) { return; }

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


	onMinuteInputChange (e) {
		const {target: {value: minutes}} = e;
		const {value} = this.state;

		if(minutes > 0 && minutes < 60 || minutes === '') {
			this.onChange(value.setMinutes(getNumber(minutes)));
		}
	}


	onMeridiemChange (period) {
		const {value} = this.state;

		this.onChange(value.setPeriod(period));
	}


	onKeyDown (e) {
		const {key, target: {name}} = e;
		const {value} = this.state;
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
		const {value} = this.state;
		const period = value.getPeriod();

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
		const {value, tfTime} = this.state;
		const meridiem = value.getPeriod();

		return (
			<SelectBox className="meridiem-select-box" disabled={tfTime} value={meridiem} options={meridiemOptions} onChange={this.onMeridiemChange}/>
		);
	}


	onHourInputBlur () {
		this.setState({
			editingHour: false
		});
	}


	render () {
		const {value, tfTime, editingHour} = this.state;
		let hours = tfTime ? value.getHours() : ((value.getHours() % 12) || 12);
		const minutes = value.getMinutes();
		if (editingHour) { hours = ''; }
		return (
			<div className="TimePicker">
				<div className="time">
					<input
						onKeyDown={this.onKeyDown}
						onChange={this.onHourInputChange}
						onBlur={this.onHourInputBlur}
						value={hours}
						type="number"
						name="hours"
						min={0} max={23}
					/> : <input
						onKeyDown={this.onKeyDown}
						onChange={this.onMinuteInputChange}
						value={minutes}
						type="number"
						name="minutes"
						min={0} max={59}
						/>
				</div>
				{this.renderMeridiem()}
			</div>
		);
	}
}
