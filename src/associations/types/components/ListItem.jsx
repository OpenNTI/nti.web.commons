import './ListItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

AssociationsListItem.propTypes = {
	className: PropTypes.string,
	active: PropTypes.bool,
	children: PropTypes.any
};
export default function AssociationsListItem ({className, active, children}) {
	const cls = cx(className, 'associations-list-item', {active});

	return (
		<div className={cls}>
			{children}
		</div>
	);
}
