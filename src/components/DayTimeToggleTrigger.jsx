import React, {PropTypes} from 'react';
import cx from 'classnames';

import DateTime from './DateTime';

export default class DayTimeToggleTrigger extends React.Component {
	static propTypes = {
		availableBeginning: PropTypes.instanceOf(Date),
		availableEnding: PropTypes.instanceOf(Date),
		onChange: PropTypes.func
	}

	render () {
		const {availableBeginning: begin, availableEnding: end, onChange} = this.props;

		const dateClassNames = cx('calendar', {empty: !begin});
		const clearClassNames = cx('clear', {empty: !begin});
		const mainTextClassNames = cx('text', {hasDate: begin});

		const mainText = !begin && !end ? 'When should students begin this lesson?' : begin && end ? `${DateTime.format(begin, 'MMMM D')} - ${DateTime.format(end, 'MMMM D')}` : `${DateTime.format(begin, 'dddd, MMMM Do, YYYY')}`;

		return (
			<div {...this.props} className="daytime-toggle-trigger">
				<div className={dateClassNames}>
					<div className="month">{DateTime.format(begin, 'MMM')}</div>
					<div className="day">{DateTime.format(begin, 'd')}</div>
				</div>
				<div className="main">
					<div className={mainTextClassNames}>
						{mainText}
						<div className={clearClassNames} onClick={onChange}>Clear</div>
					</div>
				</div>
			</div>
		);
	}
}
