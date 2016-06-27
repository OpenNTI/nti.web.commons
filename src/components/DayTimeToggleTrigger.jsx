import React, {PropTypes} from 'react';
import cx from 'classnames';

import DateTime from './DateTime';

DayTimeToggleTrigger.propTypes = {
	className: PropTypes.string,
	availableBeginning: PropTypes.instanceOf(Date).isRequired,
	availableEnding: PropTypes.instanceOf(Date).isRequired,
	onChange: PropTypes.func //OnClick??
};

export default function DayTimeToggleTrigger (props) {
	const {availableBeginning: begin, availableEnding: end, onChange, className} = props;

	const dateClassNames = cx('calendar', {empty: !begin});
	const clearClassNames = cx('clear', {empty: !begin});
	const mainTextClassNames = cx('text', {hasDate: begin});

	const mainText = !begin && !end ? 'When should students begin this lesson?' : begin && end ? `${DateTime.format(begin, 'MMMM D')} - ${DateTime.format(end, 'MMMM D')}` : `${DateTime.format(begin, 'dddd, MMMM Do, YYYY')}`;

	return (
		<div {...props} className={cx('daytime-toggle-trigger', className)}>
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
