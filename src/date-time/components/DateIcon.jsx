import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Badge from '../../components/Badge';
import {format} from '../utils';


// this Small wrapper is part of a workaround for the badge masking the part of the small icon that renders outside the
// element's actual bounds. see DateIcon.scss for details.
const Small = props => <div className="nti-calendar-date-icon-small-wrapper" {...props} />;
const Fragment = ({children}) => children;
const Badged = props => <Badge position={Badge.POSITIONS.TOP_RIGHT} {...props} {...Badge.offset(0, 4)} />;

export default class DateIcon extends React.PureComponent {

	static propTypes = {
		className: PropTypes.string,
		date: PropTypes.object,
		badge: PropTypes.number,
		small: PropTypes.bool,
		minimal: PropTypes.bool,
		viewed: PropTypes.bool
	}

	render () {
		const {date = new Date(), small, minimal, className, badge, children} = this.props;
		const Wrapper = small ? Small : Fragment;
		const Container = badge == null ? Fragment : Badged;

		return (
			<Container {...this.props}>
				<Wrapper>
					<div className={cx('nti-calendar-date-icon', {small, minimal}, className)}>
						<div className="month">{format(date, 'MMM')}</div>
						<div className="day">{format(date, 'D')}</div>
						{children}
					</div>
				</Wrapper>
			</Container>
		);
	}
}
