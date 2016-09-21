import React from 'react';

import Groups from './groups';

import ListItem from '../components/ListItem';
import ItemInfo from '../components/ItemInfo';
import AddButton from '../components/AddButton';
import RemoveButton from '../components/RemoveButton';

import DateTime from '../../../components/DateTime';
import {InlineFlyout} from '../../../components/Flyout';


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

function renderAdd (item, onAdd) {
	const trigger = (<AddButton label="Add to Lesson"/>);

	return (
		<InlineFlyout arrow trigger={trigger}>
			<Groups node={item} onAdd={onAdd} />
		</InlineFlyout>
	);
}


ContentNodeEditor.propTypes = {
	item: React.PropTypes.object,
	associations: React.PropTypes.object
};
export default function ContentNodeEditor ({item, associations}) {
	const active = associations.isSharedWith(item);

	function onAdd (parent) {
		item.onAddTo(parent);
	}

	function onRemove () {
		item.onRemoveFrom();
	}

	return (
		<ListItem className="content-node" active={active}>
			<ItemInfo label={item.label} subLabels={getSubLabels(item, active)}/>
			{!active && item.canAddTo && (renderAdd(item.item, onAdd))}
			{active && item.canRemoveFrom && (<RemoveButton onRemove={onRemove} />)}
		</ListItem>
	);
}
