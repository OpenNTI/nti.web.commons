import React from 'react';

import DateTime from './DateTime';


export default class CalendarCard extends React.Component {

	static propTypes = {
		date: React.PropTypes.instanceOf(Date)
	}

	render () {
		const {date} = this.props;

		return date && (
			<div className="calendar-card">
				<DateTime date={date} className="month" format="MMM"/>
				<DateTime date={date} className="day" format="DD"/>
			</div>
		);
	}

}
