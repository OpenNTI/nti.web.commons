import React from 'react';


function renderSubGroup (group) {
	const {items} = group;

	if (!items.length) {
		return null;
	}

	return (
		<li>
			{group.label && (<h5>group.label</h5>)}
			<Items items={items} />
		</li>
	);
}


function renderSingleItem (item) {
	return (
		<li>
			{item.label}
		</li>
	);
}



Item.PropTypes = {
	item: React.PropTypes.object
};
function Item ({item}) {
	return item.isAssociationsGroup ? renderSubGroup(item) : renderSingleItem(item);
}


Items.PropTypes = {
	items: React.PropTypes.array
};
function Items ({items}) {
	items = items || [];

	return (
		<ul>
			{items.map(x => (<Item key={x.NTIID || x.ID} item={x} />))}
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
			<Items items={items} />
		</div>
	);
}
