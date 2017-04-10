import React from 'react';
import PropTypes from 'prop-types';

import EmptyState from '../../../components/EmptyState';

import Group from './Group';


AssociationsEditorContainer.propTypes = {
	label: PropTypes.string,
	associations: PropTypes.object,
	emptyHeader: PropTypes.string,
	emptySubHeader: PropTypes.string
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
