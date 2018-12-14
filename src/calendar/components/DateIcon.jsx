import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {DateTime} from '../../';

export default class DateIcon extends React.PureComponent {

	static propTypes = {
		className: PropTypes.string,
		date: PropTypes.object,
		badge: PropTypes.number,
		viewed: PropTypes.bool,
		small: PropTypes.bool
	}

	render () {
		const {date = new Date(), className, badge, small, viewed, ...others} = this.props;

		const badgeProp = badge > 0 ? {'data-badge': badge > 99 ? '!' : badge} : {};
		const props = {...badgeProp, ...others};

		return (
			<div className={cx('nti-calendar-date-icon', className, {viewed, small})} {...props}>
				<div className="month">{DateTime.format(date, 'MMM')}</div>
				<div className="day">{DateTime.format(date, 'D')}</div>
			</div>
		);
	}
}
