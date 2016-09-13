import React from 'react';

AssociationRemove.propTypes = {
	onRemove: React.PropTypes.func
};
export default function AssociationRemove ({onRemove}) {
	return (
		<div className="association-remove-button" onClick={onRemove}>
			<i className="icon-remove" />
		</div>
	);
}
