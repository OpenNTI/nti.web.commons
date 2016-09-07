import React from 'react';
import cx from 'classnames';

AssociationsListItem.propTypes = {
	className: React.PropTypes.string,
	active: React.PropTypes.bool,
	children: React.PropTypes.any
};
export default function AssociationsListItem ({className, active, children}) {
	const cls = cx(className, 'associations-list-item', {active});

	return (
		<div className={cls}>
			{children}
		</div>
	);
}
