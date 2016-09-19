import React from 'react';
import ListItem from '../components/ListItem';
import ItemInfo from '../components/ItemInfo';
import AddButton from '../components/AddButton';
import RemoveButton from '../components/RemoveButton';

import DateTime from '../../../components/DateTime';


function getSubLabels (item, isActive) {
	const labels = [];

	if (isActive) {
		labels.push(item.group.label);
	}

	if (!item.item.isPublished()) {
		labels.push('Draft');
	} else if (item.item.AvailableBeginning) {
		labels.push(`Scheduled for ${DateTime.format(item.item.getAvailableBeginning(), 'll')}`);
	} else {
		labels.push('Published');
	}

	return labels;
}


ContentNodeEditor.propTypes = {
	item: React.PropTypes.object,
	associations: React.PropTypes.object
};
export default function ContentNodeEditor ({item, associations}) {
	const active = associations.isSharedWith(item);

	function onAdd () {
		item.onAddTo();
	}

	function onRemove () {
		item.onRemoveFrom();
	}

	return (
		<ListItem className="content-node" active={active}>
			<ItemInfo label={item.label} subLabels={getSubLabels(item, active)}/>
			{!active && item.canAddTo && (<AddButton onAdd={onAdd} />)}
			{active && item.canRemoveFrom && (<RemoveButton onRemove={onRemove} />)}
		</ListItem>
	);
}
