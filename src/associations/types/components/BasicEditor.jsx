import React from 'react';
import {scoped} from 'nti-lib-locale';

import ListItem from './ListItem';
import ItemInfo from './ItemInfo';
import ErrorCmp from './Error';
import AddButton from './AddButton';
import RemoveButton from './RemoveButton';

const DEFAULT_TEXT = {
	addLabel: 'Add',
	failedToAdd: 'Failed to add.',
	failedToRemove: 'Failed to remove.'
};

const t = scoped('BASIC_ASSOCIATION_EDITOR', DEFAULT_TEXT);

export default class BasicEditor extends React.Component {
	static propTypes = {
		item: React.PropTypes.object.isRequired,
		associations: React.PropTypes.object.isRequired,
		subLabels: React.PropTypes.array,
		className: React.PropTypes.string,
		getString: React.PropTypes.func
	}


	onAdd = () => {
		const {item} = this.props;

		debugger;
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


	render () {
		const {item, associations, subLabels, className} = this.props;
		const active = associations.isSharedWith(item);
		const getString = this.getStringsFn();

		return (
			<ListItem className={className} active={active}>
				<ItemInfo label={item.label} subLabels={subLabels} />
				{item.error && (<ErrorCmp error={getString(active ? 'failedToAdd' : 'failedToRemove')} white={active} />)}
				{!active && item.canAddTo && this.renderAdd()}
				{active && item.canRemoveFrom && this.renderRemove()}
			</ListItem>
		);
	}


	renderAdd = () => {
		const {item} = this.props;
		const getString = this.getStringsFn();
		let addButton;

		if (item.isSaving) {
			addButton = this.renderSaving();
		} else {
			addButton = (
				<AddButton label={getString('addLabel')} error={item.error} onClick={this.onAdd} />
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
				<RemoveButton onRemove={this.onRemove} error={item.error} />
			);
		}

		return removeButton;
	}


	renderSaving = () => {
		//TODO: replace this with spinner
		return (
			<span>Saving</span>
		);
	}

}
