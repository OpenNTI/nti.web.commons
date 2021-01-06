import './DayTimeToggleTrigger.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {
	format,
	DAY_OF_THE_MONTH,
	MONTH_ABBR,
	MONTH_NAME_DAY,
	WEEKDAY_MONTH_NAME_ORDINAL_DAY_YEAR
} from '../utils';

export default class DayTimeToggleTrigger extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		availableBeginning: PropTypes.instanceOf(Date),
		availableEnding: PropTypes.instanceOf(Date),
		onChange: PropTypes.func,
		disableText: PropTypes.bool
	}

	domNode = React.createRef()

	getDOMNode () {
		return this.domNode.current;
	}

	render () {
		const {availableBeginning: begin, availableEnding: end, onChange, className, disableText, ...otherProps} = this.props;

		const dateClassNames = cx('calendar', {empty: !begin});
		const clearClassNames = cx('clear', {empty: !begin});
		const mainTextClassNames = cx('text', {hasDate: begin}, {hide: disableText});

		const mainText = !begin && !end
			? 'When should students begin this lesson?'
			: begin && end
				? `${format(begin, MONTH_NAME_DAY)} - ${format(end, MONTH_NAME_DAY)}`
				: `${format(begin, WEEKDAY_MONTH_NAME_ORDINAL_DAY_YEAR)}`;

		return (
			<div {...otherProps} className={cx('daytime-toggle-trigger', className)} ref={this.domNode}>
				<div className={dateClassNames}>
					<div className="month">{format(begin, MONTH_ABBR)}</div>
					<div className="day">{format(begin, DAY_OF_THE_MONTH)}</div>
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
