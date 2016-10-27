import React from 'react';
import {scoped} from 'nti-lib-locale';

import ListItem from './ListItem';
import ItemInfo from './ItemInfo';
import ErrorCmp from './Error';
import AddButton from './AddButton';
import RemoveButton from './RemoveButton';

import ItemChanges from '../../../HighOrderComponents/ItemChanges';
import {Loading} from '../../../components';

const DEFAULT_TEXT = {
	addLabel: 'Add',
	failedToAdd: 'Failed to add.',
	failedToRemove: 'Failed to remove.'
};

const t = scoped('BASIC_ASSOCIATION_EDITOR', DEFAULT_TEXT);

class BasicEditor extends React.Component {
	static propTypes = {
		item: React.PropTypes.object.isRequired,
		associations: React.PropTypes.object.isRequired,
		subLabels: React.PropTypes.array,
		className: React.PropTypes.string,
		getString: React.PropTypes.func,
		disabled: React.PropTypes.bool
	}


	onAdd = () => {
		const {item} = this.props;

		item.onAddTo();
	}


	onRemove = () => {
		const {item} = this.props;

		item.onRemoveFrom();
	}


	getStringsFn = () => {
		const {getString} = this.props;

		return getString ? t.override(getString) : t;
	}

	isCancelAction (item) {
		const {error} = item;

		// NOTE: When a 409 is thrown a challenge is raised and
		// the user has two either confirm it or cancel it.
		// Thus as such, the only time that the error will be propageted
		// all the way to this component is when the user chose to cancel
		// thus the promise is rejected. So, we can use it to conclude that
		// the user cancel the action.
		return (error || {}).statusCode === 409;
	}


	render () {
		const {item, associations, subLabels, className} = this.props;
		const active = associations.isSharedWith(item);
		const getString = this.getStringsFn();
		const isCancel = this.isCancelAction(item);

		return (
			<ListItem className={className} active={active}>
				<ItemInfo label={item.label} subLabels={subLabels} />
				{item.error && !isCancel && (<ErrorCmp error={getString(active ? 'failedToAdd' : 'failedToRemove')} white={active} />)}
				{(!active || isCancel) && item.canAddTo && this.renderAdd()}
				{active  && item.canRemoveFrom && this.renderRemove()}
			</ListItem>
		);
	}


	renderAdd = () => {
		const {item, disabled} = this.props;
		const getString = this.getStringsFn();
		const isCancel = this.isCancelAction(item);
		let addButton;

		if (item.isSaving) {
			addButton = this.renderSaving();
		} else {
			addButton = (
				<AddButton label={getString('addLabel')} error={!!item.error && !isCancel} onClick={this.onAdd} disabled={disabled} />
			);
		}

		return addButton;
	}


	renderRemove = () => {
		const {item} = this.props;
		let removeButton;

		if (item.isSaving) {
			removeButton = this.renderSaving();
		} else {
			removeButton = (
				<RemoveButton onRemove={this.onRemove} error={!!item.error} />
			);
		}

		return removeButton;
	}


	renderSaving = () => {
		const {item, associations} = this.props;
		const active = associations.isSharedWith(item);

		return (
			<Loading.Spinner white={active} />
		);
	}

}

export default ItemChanges.compose(BasicEditor);
