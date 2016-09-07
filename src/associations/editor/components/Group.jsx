import React from 'react';

function renderSubGroup (group) {
	const {items} = group;

	if (!items.length) {
		return null;
	}

	return (
		<li key={group.ID}>
			{group.label && (<h5>group.label</h5>)}
			{renderItems(items)}
		</li>
	);
}


function renderSingleItem (item) {
	return (
		<li key={item.NTIID || item.ID}>
			{item.label}
		</li>
	);
}


function renderItem (item) {
	debugger;
	return item.isAssociationsGroup ? renderSubGroup(item) : renderSingleItem(item);
}


function renderItems (items) {
	items = items || [];

	return (
		<ul>
			{items.map(renderItem)}
		</ul>
	);
}


AssociationGroup.propTypes = {
	group: React.PropTypes.object
};
export default function AssociationGroup ({group}) {
	const {label, items} = group;

	return (
		<div className="associations-group">
			{label && (<h4>{label}</h4>)}
			{renderItems(items)}
		</div>
	);
}
