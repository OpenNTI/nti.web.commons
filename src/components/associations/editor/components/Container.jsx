import React from 'react';
import Group from './Group';

AssociationsEditorContainer.propTypes = {
	label: React.PropTypes.string,
	groups: React.PropTypes.array
};
export default function AssociationsEditorContainer ({label, groups}) {
	return (
		<div className="associations-editor-container">
			{label && (<h3>{label}</h3>)}
			{groups.map(x => (<Group key={x.NTIID || x.ID} group={x} />))}
		</div>
	);
}
