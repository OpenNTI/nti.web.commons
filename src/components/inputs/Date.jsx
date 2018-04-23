import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import cx from 'classnames';

import SelectInput from './select';
import NumberInput from './Number';

const t = scoped('common.inputs.Date', {
	months: {
		0: 'January',
		1: 'February',
		2: 'March',
		3: 'April',
		4: 'May',
		5: 'June',
		6: 'July',
		7: 'August',
		8: 'September',
		9: 'October',
		10: 'November',
		11: 'December'
	},
	placeholders: {
		month: 'Month',
		year: 'Year'
	}
});
const getMonthLabel = m => t(`months.${m}`);

const Precision = {
	year: 1,
	month: 2,
	day: 3,
	time: 4
};


const DateFromPrecision = {
	[Precision.year]: (state) => {
		if (state.year == null || state.year < 1900) { return null; }

		const date = new Date();

		date.setFullYear(state.year);
		date.setMonth(0);
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		return date;
	},
	[Precision.month]: (state) => {
		const date = DateFromPrecision[Precision.year](state);

		if (state.month == null || !date) { return null; }

		date.setMonth(state.month);

		return date;
	}
};


export default class DateInput extends React.Component {
	static Precision = Precision

	static propTypes = {
		className: PropTypes.string,
		value: PropTypes.object,
		onChange: PropTypes.func,

		precision: PropTypes.oneOf(Object.values(Precision))
	}

	static defaultProps = {
		precision: Precision.time
	}

	state = {
		possibleMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
	}

	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {value: oldValue} = prevProps;
		const {value: newValue} = this.props;

		if (newValue !== oldValue) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {value, precision} = props;

		if (!value) {
			this.setState({});
			return;
		}

		let state = {};

		if (precision >= Precision.year) {
			state.year = value.getFullYear();
		}

		if (precision >= Precision.month) {
			state.month = value.getMonth();
		}

		this.setState(state);
	}


	onChange () {
		const {precision, onChange, value} = this.props;
		const date = DateFromPrecision[precision](this.state);

		if (onChange && value !== date) {
			onChange(date);
		}
	}


	setMonth = (month) => {
		this.setState({
			month
		}, () => this.onChange());
	}

	monthMatches = (month, term) => {
		const label = getMonthLabel(month);

		return label.toLowerCase().indexOf(term.toLowerCase()) === 0;
	}


	setYear = (year) => {
		this.setState({
			year
		}, () => this.onChange());
	}


	render () {
		const {className, precision} = this.props;

		return (
			<div className={cx('nti-date-input', className, [`precision-${precision}`])}>
				{this.renderMonth()}
				{this.renderDay()}
				{this.renderYear()}
			</div>
		);
	}


	renderMonth () {
		const {precision} = this.props;
		const {month, possibleMonths} = this.state;

		if (precision < Precision.month) { return null; }

		return (
			<SelectInput
				className="month-input"
				value={month}
				placeholder={t('placeholders.month')}
				onChange={this.setMonth}
			>
				{possibleMonths.map((m) => {
					return (
						<SelectInput.Option key={m} value={m} matches={this.monthMatches}>
							{getMonthLabel(m)}
						</SelectInput.Option>
					);
				})}
			</SelectInput>
		);
	}


	renderDay () {
		return null;
	}


	renderYear () {
		const {year} = this.state;

		return (
			<NumberInput
				className="year-input"
				value={year}
				placeholder={t('placeholders.year')}
				onChange={this.setYear}
				min={1900}
			/>
		);
	}
}
