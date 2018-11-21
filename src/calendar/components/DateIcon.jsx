import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {DateTime} from '../../';

export default class DateIcon extends React.PureComponent {

	static propTypes = {
		className: PropTypes.string,
		date: PropTypes.object,
		badge: PropTypes.number
	}

	render () {
		const {date = new Date(), className, badge, ...others} = this.props;

		const badgeProp = badge == null ? {} : {'data-badge': badge};
		const props = {...badgeProp, ...others};

		return (
			<div className={cx('nti-calendar-date-icon', className)} {...props}>
				<div className="month">{DateTime.format(date, 'MMM')}</div>
				<div className="day">{DateTime.format(date, 'D')}</div>
			</div>
		);
	}
}
