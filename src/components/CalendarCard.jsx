import './CalendarCard.scss';
import React from 'react';
import PropTypes from 'prop-types';

import DateTime from '../date-time';


export default class CalendarCard extends React.Component {

	static propTypes = {
		date: PropTypes.instanceOf(Date)
	}

	render () {
		const {date} = this.props;

		return date && (
			<div className="calendar-card">
				<DateTime date={date} className="month" format={DateTime.MONTH_ABBR}/>
				<DateTime date={date} className="day" format={DateTime.DAY_OF_THE_MONTH_PADDED}/>
			</div>
		);
	}

}
