import React from 'react';

AssociationItemInfo.propTypes = {
	label: React.PropTypes.string,
	subLabels: React.PropTypes.array
};
export default function AssociationItemInfo ({label}) {
	return (
		<span>{label}</span>
	);
}
