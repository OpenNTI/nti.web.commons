import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {DateTime, Badge} from '../../';

export default class DateIcon extends React.PureComponent {

	static propTypes = {
		className: PropTypes.string,
		date: PropTypes.object,
		badge: PropTypes.number,
		viewed: PropTypes.bool
	}

	render () {
		const {date = new Date(), className} = this.props;

		return (
			<Badge position={Badge.POSITIONS.TOP_RIGHT} {...this.props}>
				<div className={cx('nti-calendar-date-icon', className)}>
					<div className="month">{DateTime.format(date, 'MMM')}</div>
					<div className="day">{DateTime.format(date, 'D')}</div>
				</div>
			</Badge>
		);
	}
}
