import React from 'react';

import EmptyState from '../../../components/EmptyState';

import Group from './Group';


AssociationsEditorContainer.propTypes = {
	label: React.PropTypes.string,
	associations: React.PropTypes.object,
	emptyHeader: React.PropTypes.string,
	emptySubHeader: React.PropTypes.string
};
export default function AssociationsEditorContainer ({label, associations, emptyHeader, emptySubHeader}) {
	const groups = associations.destinations;

	return (
		<div className="associations-editor-container">
			{label && (<h3>{label}</h3>)}
			{associations.isEmpty ?
				(<EmptyState header={emptyHeader} subHeader={emptySubHeader} />) :
				groups.map((x, i) => (<Group key={i} group={x} associations={associations}/>))
			}
		</div>
	);
}
