import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {modal} from '../../prompts';
import DialogButtons from '../DialogButtons';

import Browser from './Browser';

export default class Chooser extends React.Component {
	static propTypes = {
		accept: PropTypes.func,
		filter: PropTypes.func,
		limited: PropTypes.bool,
		sourceID: PropTypes.string,
		onCancel: PropTypes.func,
		onDismiss: PropTypes.func,
		onSelect: PropTypes.func,
		selectButtonLabel: PropTypes.string
	}

	/**
	 * Open a Resource Browser-Picker. Currently only allowing a single item to be selected.
	 *
	 * @param  {string} sourceID - an NTIID of the resource provider. (eg: CourseInstance)
	 * @param  {function} [accept] - A callback that inspects a File/Folder. Return true to make it selectable.
	 * @param  {function} [filter] - A callback that inspects a File/Folder. Return falsy to remove it from
	 *                           the list. Truthy to include it.
	 * @param  {string} [selectButtonLabel] - Sets the label on the "Accept/Select" blue button.
	 * @param  {boolean} [limited] - Restricts actions to basic selections.
	 * @return {Promise} Will fulfill with the File(s) or Folder(s) object the user selected.
	 */
	static show (sourceID, accept, filter, selectButtonLabel, limited) {
		return new Promise((select, reject) => {
			modal(
				<Chooser sourceID={sourceID}
					accept={accept}
					filter={filter}
					selectButtonLabel={selectButtonLabel}
					onCancel={reject}
					onSelect={select}
					limited={!!limited}
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
		const matchesAccepts = x => x && (!accept || accept(x));

		this.setState({
			selected: (item
					&& matchesAccepts(item)
					&& matchesFilter(item)
					//Singleton selections will also have "current folder" in the items.
					&& items && items.length <= 2) ? item : void 0
		});
	}


	onTrigger = (item) => {
		return (item === this.state.selected && !item.isFolder && this.onSelect());
	}


	render () {
		const {
			state: {selected},
			props:{
				accept,
				filter,
				limited,
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
					limited={limited}
					/>
				<DialogButtons buttons={buttons}/>
			</div>
		);
	}
}
