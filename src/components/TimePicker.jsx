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
			tfTime: false
		};

		autobind(this,'onKeyDown','onHourInputChange','onMinuteInputChange','onMeridiemChange');

		this.onChange = value => {
			const {onChange} = this.props;
			if (onChange) {
				onChange(value.date);
			}

			this.setState({value});
		};
	}

	componentWillReceiveProps (nextProps) {
		if(nextProps.value !== this.props.value) {
			this.setState({
				value: this.getValue(nextProps)
			});
		}
	}

	getValue (props = this.props) {
		const {value} = props;

		let time = value && TimeMap.get(value);
		if (value && !time) {
			TimeMap.set(value, time = new Time(value));
		}

		return time || this.state.value;
	}


	onHourInputChange (e) {
		const {target: {value: hours}} = e;
		const {tfTime} = this.state;
		const value = this.getValue();

		let num = getNumber(hours);
		if (num == null) {
			//reset
			this.setState({tfTime: false});
		} else if (num === 0 || num > 12) {
			//turn on 24hour
			this.setState({tfTime: true});
		} else if (!tfTime) {
			num = this.convertHours(num);
		}

		this.onChange(value.setHours(num));
	}


	onMinuteInputChange (e) {
		const {target: {value: minutes}} = e;
		const value = this.getValue();
		this.onChange(value.setMinutes(getNumber(minutes)));
	}


	onMeridiemChange (period) {
		const {value} = this.state;

		this.onChange(value.setPeriod(period));
	}


	onKeyDown (e) {
		const {key, target: {name}} = e;
		const value = this.getValue();
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

			this.onChange(value[fn]());
		}
	}


	convertHours (h) {
		const value = this.getValue();
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
		const {value} = this.state;
		const meridiem = value.getPeriod();
		const {tfTime} = this.state;

		return (
			<SelectBox className="meridiem-select-box" disabled={tfTime} value={meridiem} options={meridiemOptions} onChange={this.onMeridiemChange}/>
		);
	}

	render () {
		const {value, tfTime} = this.state;
		const hours = tfTime ? value.getHours() : ((value.getHours() % 12) || 12);
		const minutes = value.getMinutes();

		return (
			<div className="TimePicker">
				<div className="time">
					<input
						onKeyDown={this.onKeyDown}
						onChange={this.onHourInputChange}
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
