import React from 'react';
import cx from 'classnames';

import {modal} from '../../prompts';

import DialogButtons from '../DialogButtons';

import Browser from './Browser';

export default class Chooser extends React.Component {
	static propTypes = {
		accept: React.PropTypes.func,
		filter: React.PropTypes.func,
		sourceID: React.PropTypes.string,
		onCancel: React.PropTypes.func,
		onDismiss: React.PropTypes.func,
		onSelect: React.PropTypes.func,
		selectButtonLabel: React.PropTypes.string
	}

	/**
	 * Open a Resource Browser-Picker. Currently only allowing a single item to be selected.
	 *
	 * @param  {string} sourceID - an NTIID of the resource provider. (eg: CourseInstance)
	 * @param  {function} [accept] - A callback that inspects a File/Folder. Return true to make it selectable.
	 * @param  {function} [filter] - A callback that inspects a File/Folder. Return falsy to remove it from
	 *                           the list. Truthy to include it.
	 * @param  {string} [labelOfButton] - Sets the label on the "Accept/Select" blue button.
	 * @return {Promise} Will fulfill with the File(s) or Folder(s) object the user selected.
	 */
	static show (sourceID, accept, filter, verb) {
		return new Promise((select, reject) => {
			modal(
				<Chooser sourceID={sourceID}
					accept={accept}
					filter={filter}
					selectButtonLabel={verb}
					onCancel={reject}
					onSelect={select}
					/>,
				'content-resource-chooser-dialog'
			);
		});
	}

	state = {}


	dismiss () {
		const {onDismiss} = this.props;
		if (onDismiss) {
			onDismiss();
		}
	}


	onCancel = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		const {onCancel} = this.props;

		if (onCancel) {
			onCancel();
		}

		this.dismiss();
	}


	onSelect = (e) => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		const {props: {onSelect}, state: {selected}} = this;
		if (!selected) { return; }

		if (onSelect) {
			onSelect(selected);
		}
		this.dismiss();
		return true;
	}


	onSelectionChange = (items) => {
		const {accept, filter} = this.props;
		const [item] = items || [];
		const matchesFilter = x => x && (!filter || filter(x));
		const matchesAccepts = x => x && (!filter || accept(x));

		this.setState({
			selected: (item
					&& matchesAccepts(item)
					&& matchesFilter(item)
					&& items && items.length === 1) ? item : void 0
		});
	}


	onTrigger = (item) => {
		return (item === this.state.selected && this.onSelect());
	}


	render () {
		const {
			state: {selected},
			props:{
				accept,
				filter,
				sourceID,
				selectButtonLabel
			}
		} = this;

		const buttons = [
			{
				label: 'Cancel',
				className: 'cancel',
				onClick: this.onCancel
			},
			{
				className: cx({disabled: !selected}),
				label: selectButtonLabel || 'Select',
				onClick: this.onSelect
			}
		];

		return (
			<div className="content-resource-chooser">
				<Browser sourceID={sourceID}
					accept={accept}
					filter={filter}
					onClose={this.onCancel}
					onSelectionChange={this.onSelectionChange}
					onTrigger={this.onTrigger}
					/>
				<DialogButtons buttons={buttons}/>
			</div>
		);
	}
}
