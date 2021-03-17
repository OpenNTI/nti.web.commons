import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import ListItem from '../components/ListItem';
import ItemInfo from '../components/ItemInfo';
import AddButton from '../components/AddButton';
import RemoveButton from '../components/RemoveButton';
import Locations from '../components/Locations';
import ErrorCmp from '../components/Error';
//
import { DateTime } from '../../../';
import { Loading } from '../../../components';
import { InlineFlyout } from '../../../flyout';
import ItemChanges from '../../../HighOrderComponents/ItemChanges';

import Groups from './groups';

const DEFAULT_TEXT = {
	addLabel: 'Add to Lesson',
	errorLabel: 'Failed: Try again',
	draft: 'Draft',
	schedule: 'Scheduled for %(date)s',
	published: 'Published',
	failedToAdd: 'Failed to add.',
	failedToRemove: 'Failed to remove.',
};

const t = scoped(
	'common.components.associations.editor.content_node',
	DEFAULT_TEXT
);

function getCountFor(item, overview) {
	const refs = overview.getRefsTo(item);

	return refs.length;
}

function getSubLabels(item, isActive) {
	const labels = [];

	if (isActive) {
		labels.push(item.group.label);
	}

	if (!item.item.isPublished()) {
		labels.push(t('draft'));
	} else if (item.item.getAvailableBeginning) {
		labels.push(
			t('schedule', {
				date: DateTime.format(
					item.item.getAvailableBeginning(),
					DateTime.MONTH_ABBR_DAY_YEAR
				),
			})
		);
	} else {
		labels.push(t('published'));
	}

	return labels;
}

function getTrigger(item) {
	let trigger;

	if (item.isSaving) {
		trigger = <Loading.Spinner />;
	} else {
		trigger = <AddButton label={t('addLabel')} error={!!item.error} />;
	}

	return trigger;
}

function renderAdd(item, onAdd) {
	const trigger = getTrigger(item);

	return (
		<InlineFlyout arrow trigger={trigger}>
			<Groups node={item.item} onAdd={onAdd} />
		</InlineFlyout>
	);
}

function renderRemove(item, count, onRemove) {
	let remove;

	if (item.isSaving) {
		remove = <Loading.Spinner white />;
	} else {
		remove = (
			<RemoveButton
				count={count}
				onRemove={onRemove}
				error={!!item.error}
			/>
		);
	}

	return remove;
}

const ContentNodeEditor = React.forwardRef(({ item, associations }, ref) => {
	const active = associations.getAssociationFor(item);
	const count = active && getCountFor(associations.backingItem, active);

	const onAdd = useCallback(
		(group, overview) => item.onAddTo(group, overview),
		[item]
	);
	const onRemove = useCallback(() => item.onRemoveFrom(active), [item]);

	return (
		<ListItem ref={ref} className="content-node" active={!!active}>
			<ItemInfo
				label={item.label}
				subLabels={getSubLabels(item, active)}
			/>
			{item.error && (
				<ErrorCmp
					error={t(active ? 'failedToRemove' : 'failedToAdd')}
					white={!!active}
				/>
			)}
			{!active && item.canAddTo && renderAdd(item, onAdd)}
			{active && !item.isSaving && !item.error && count > 1 ? (
				<Locations count={count} />
			) : null}
			{active &&
				item.canRemoveFrom &&
				renderRemove(item, count, onRemove)}
		</ListItem>
	);
});

ContentNodeEditor.propTypes = {
	item: PropTypes.object,
	associations: PropTypes.object,
};

export default ItemChanges.compose(ContentNodeEditor);
