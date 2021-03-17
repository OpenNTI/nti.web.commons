import './ListItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export const AssociationsListItem = React.forwardRef(
	({ className, active, children }, ref) => {
		return (
			<div
				ref={ref}
				className={cx(className, 'associations-list-item', { active })}
			>
				{children}
			</div>
		);
	}
);

AssociationsListItem.propTypes = {
	className: PropTypes.string,
	active: PropTypes.bool,
	children: PropTypes.any,
};

export default AssociationsListItem;
