import './DateIcon.scss';
import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Badge from '../../components/Badge';
import {DAY_OF_THE_MONTH, format, MONTH_ABBR} from '../utils';


// this Small wrapper is part of a workaround for the badge masking the part of the small icon that renders outside the
// element's actual bounds. see DateIcon.scss for details.
const Small = props => <div className="nti-calendar-date-icon-small-wrapper" {...props} />;
const Badged = props => <Badge position={Badge.POSITIONS.TOP_RIGHT} {...props} {...Badge.offset(0, 4)} />;

const DateIcon = React.forwardRef(({date = new Date(), small, minimal, className, badge, children, onClick, ...props}, ref) => {
	const Wrapper = small ? Small : Fragment;
	const Container = badge == null ? Fragment : Badged;

	return (
		<Container {...props} badge={badge}>
			<Wrapper>
				<div className={cx('nti-calendar-date-icon', {small, minimal}, className)} onClick={onClick} ref={ref}>
					<div className="month">{format(date, MONTH_ABBR)}</div>
					<div className="day">{format(date, DAY_OF_THE_MONTH)}</div>
					{children}
				</div>
			</Wrapper>
		</Container>
	);
});

DateIcon.propTypes = {
	className: PropTypes.string,
	date: PropTypes.object,
	badge: PropTypes.number,
	small: PropTypes.bool,
	minimal: PropTypes.bool,
	viewed: PropTypes.bool,
	onClick: PropTypes.func,
};
