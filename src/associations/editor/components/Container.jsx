import React from 'react';
import Group from './Group';
import EmptyState from '../../../components/EmptyState';

function isEmpty (groups) {
	return groups.every(x => x.isEmpty);
}

AssociationsEditorContainer.propTypes = {
	label: React.PropTypes.string,
	groups: React.PropTypes.array,
	associations: React.PropTypes.object,
	emptyHeader: React.PropTypes.string,
	emptySubHeader: React.PropTypes.string
};
export default function AssociationsEditorContainer ({label, groups, associations, emptyHeader, emptySubHeader}) {
	const empty = isEmpty(groups);

	return (
		<div className="associations-editor-container">
			{label && (<h3>{label}</h3>)}
			{empty ?
				(<EmptyState header={emptyHeader} subHeader={emptySubHeader} />) :
				groups.map(x => (<Group key={x.NTIID || x.ID} group={x} associations={associations}/>))
			}
		</div>
	);
}
