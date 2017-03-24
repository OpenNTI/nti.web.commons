import React from 'react';
import {scoped} from 'nti-lib-locale';

import ListItem from '../components/ListItem';
import ItemInfo from '../components/ItemInfo';
import AddButton from '../components/AddButton';
import RemoveButton from '../components/RemoveButton';
import Locations from '../components/Locations';
import ErrorCmp from '../components/Error';
//
import DateTime from '../../../components/DateTime';
import {InlineFlyout} from '../../../components/flyout';
import ItemChanges from '../../../HighOrderComponents/ItemChanges';
import {Loading} from '../../../components';

import Groups from './groups';

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

function getCountFor (item, overview) {
	const refs = overview.getRefsTo(item);

	return refs.length;
}


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
		trigger = (<Loading.Spinner />);
	} else {
		trigger = (<AddButton label={t('addLabel')} error={!!item.error} />);
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


function renderRemove (item, count, onRemove) {
	let remove;

	if (item.isSaving) {
		remove = (<Loading.Spinner white />);
	} else {
		remove = (<RemoveButton count={count}  onRemove={onRemove} error={!!item.error} />);
	}

	return remove;
}


ContentNodeEditor.propTypes = {
	item: React.PropTypes.object,
	associations: React.PropTypes.object
};
function ContentNodeEditor ({item, associations}) {
	const active = associations.getAssociationFor(item);
	const count = active && getCountFor(associations.backingItem, active);

	function onAdd (group, overview) {
		item.onAddTo(group, overview);
	}

	function onRemove () {
		item.onRemoveFrom(active);
	}

	return (
		<ListItem className="content-node" active={!!active}>
			<ItemInfo label={item.label} subLabels={getSubLabels(item, active)}/>
			{item.error && (<ErrorCmp error={t(active ? 'failedToRemove' : 'failedToAdd')} white={!!active} />)}
			{!active && item.canAddTo && (renderAdd(item, onAdd))}
			{active && !item.isSaving && !item.error && count > 1 ? (<Locations count={count} />) : null}
			{active && item.canRemoveFrom && (renderRemove(item, count, onRemove))}
		</ListItem>
	);
}

export default ItemChanges.compose(ContentNodeEditor);
