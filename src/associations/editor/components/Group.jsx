import React from 'react';

import {getEditorCmpFor} from '../../types';

function renderSubGroup (group, associations) {
	const {items} = group;

	if (!items.length) {
		return null;
	}

	return (
		<li key={group.ID}>
			{group.label && (<h5>group.label</h5>)}
			{renderItems(items, associations)}
		</li>
	);
}


function renderSingleItem (item, associations) {
	const Editor = getEditorCmpFor(item);

	if (!Editor) {
		return null;
	}

	return (
		<li key={item.NTIID || item.ID}>
			<Editor item={item} associations={associations} />
		</li>
	);
}


function renderItem (item, associations) {
	return item.isAssociationsGroup ? renderSubGroup(item, associations) : renderSingleItem(item, associations);
}


function renderItems (items, associations) {
	items = items || [];

	return (
		<ul>
			{items.map(x => renderItem(x, associations))}
		</ul>
	);
}


AssociationGroup.propTypes = {
	group: React.PropTypes.object,
	associations: React.PropTypes.object
};
export default function AssociationGroup ({group, associations}) {
	const {label, items} = group;

	return (
		<div className="associations-group">
			{label && (<h4>{label}</h4>)}
			{renderItems(items, associations)}
		</div>
	);
}
