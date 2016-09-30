import React from 'react';
import {scoped} from 'nti-lib-locale';

import Groups from './groups';

import ListItem from '../components/ListItem';
import ItemInfo from '../components/ItemInfo';
import AddButton from '../components/AddButton';
import RemoveButton from '../components/RemoveButton';
import ErrorCmp from '../components/Error';

import DateTime from '../../../components/DateTime';
import {InlineFlyout} from '../../../components/Flyout';
import ItemChanges from '../../../HighOrderComponents/ItemChanges';

const DEFAULT_TEXT = {
	addLabel: 'Add to Lesson',
	errorLabel: 'Failed: Try again',
	draft: 'Draft',
	schedule: 'Scheduled for %(date)s',
	published: 'Published',
	failedToAdd: 'Failed to add.',
	failedToRemove: 'Failed to remove.'
};

const t = scoped('ASSOCIATION_CONTENT_NODE_EDITOR', DEFAULT_TEXT);


function getSubLabels (item, isActive) {
	const labels = [];

	if (isActive) {
		labels.push(item.group.label);
	}

	if (!item.item.isPublished()) {
		labels.push(t('draft'));
	} else if (item.item.AvailableBeginning) {
		labels.push(t('schedule', {date: DateTime.format(item.item.getAvailableBeginning(), 'll')}));
	} else {
		labels.push(t('published'));
	}

	return labels;
}


function getTrigger (item) {
	let trigger;

	if (item.isSaving) {
		//TODO: replace this with the new spinner
		trigger = (<span>Saving</span>);
	} else {
		trigger = (<AddButton label={t('addLabel')} error={item.error} />);
	}

	return trigger;
}


function renderAdd (item, onAdd) {
	const trigger = getTrigger(item);

	return (
		<InlineFlyout arrow trigger={trigger}>
			<Groups node={item.item} onAdd={onAdd} />
		</InlineFlyout>
	);
}


function renderRemove (item, onRemove) {
	let remove;

	if (item.isSaving) {
		//TODO: replace this with the new spinner
		remove = (<span>Saving</span>);
	} else {
		remove = (<RemoveButton  onRemove={onRemove} error={item.error} />);
	}

	return remove;
}


ContentNodeEditor.propTypes = {
	item: React.PropTypes.object,
	associations: React.PropTypes.object
};
function ContentNodeEditor ({item, associations}) {
	const active = associations.isSharedWith(item);

	function onAdd (container) {
		item.onAddTo(container);
	}

	function onRemove () {
		item.onRemoveFrom();
	}

	return (
		<ListItem className="content-node" active={active}>
			<ItemInfo label={item.label} subLabels={getSubLabels(item, active)}/>
			{item.error && (<ErrorCmp error={t(active ? 'failedToAdd' : 'failedToRemove')} white={active} />)}
			{!active && item.canAddTo && (renderAdd(item, onAdd))}
			{active && item.canRemoveFrom && (renderRemove(item, onRemove))}
		</ListItem>
	);
}

export default ItemChanges.compose(ContentNodeEditor);
