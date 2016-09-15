import React from 'react';
import ListItem from '../components/ListItem';
import ItemInfo from '../components/ItemInfo';
import AddButton from '../components/AddButton';
import RemoveButton from '../components/RemoveButton';

DefaultEditor.propTypes = {
	item: React.PropTypes.object,
	associations: React.PropTypes.object
};
export default function DefaultEditor ({item, associations}) {
	const active = associations.isSharedWith(item);

	function onAdd () {
		item.onAddTo();
	}

	function onRemove () {
		item.onRemoveFrom();
	}

	return (
		<ListItem active={active}>
			<ItemInfo label={item.label} subLabels={[item.group.label, 'Test label']}/>
			{!active && item.canAddTo && (<AddButton onAdd={onAdd} />)}
			{active && item.canRemoveFrom && (<RemoveButton onRemove={onRemove} />)}
		</ListItem>
	);
}
