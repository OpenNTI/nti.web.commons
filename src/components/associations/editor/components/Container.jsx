import React from 'react';
import Group from './Group';

AssociationsEditorContainer.propTypes = {
	label: React.PropTypes.string,
	groups: React.PropTypes.array,
	associations: React.PropTypes.object
};
export default function AssociationsEditorContainer ({label, groups, associations}) {
	return (
		<div className="associations-editor-container">
			{label && (<h3>{label}</h3>)}
			{groups.map(x => (<Group key={x.NTIID || x.ID} group={x} associations={associations}/>))}
		</div>
	);
}
