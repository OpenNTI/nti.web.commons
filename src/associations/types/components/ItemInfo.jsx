import React from 'react';

AssociationItemInfo.propTypes = {
	label: React.PropTypes.string,
	subLabels: React.PropTypes.array
};
export default function AssociationItemInfo ({label}) {
	return (
		<div className="association-item-info">
			<span className="label">{label}</span>
		</div>
	);
}
