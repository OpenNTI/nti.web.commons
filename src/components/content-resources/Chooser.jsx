import React from 'react';
import cx from 'classnames';

import {modal} from '../../prompts';

import DialogButtons from '../DialogButtons';

import Browser from './Browser';

export default class Chooser extends React.Component {
	static propTypes = {
		filter: React.PropTypes.func,
		selectable: React.PropTypes.func,
		sourceID: React.PropTypes.string,
		onCancel: React.PropTypes.func,
		onDismiss: React.PropTypes.func,
		onSelect: React.PropTypes.func,
		selectButtonLabel: React.PropTypes.string
	}


	static show (sourceID, filter, selectable, verb) {
		return new Promise((select, reject) => {
			modal(
				<Chooser sourceID={sourceID}
					filter={filter}
					selectable={selectable}
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


	onSelect = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const {props: {onSelect}, state: {selected}} = this;
		if (!selected) { return; }

		if (onSelect) {
			onSelect(selected);
		}
		this.dismiss();
	}


	onSelectionChange = (items) => {
		const {filter} = this.props;
		const [item] = items || [];

		this.setState({
			selected: (item && (!filter || filter(item)) && items && items.length === 1) ? item : void 0
		});
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

	render () {
		const {
			state: {selected},
			props:{
				filter,
				selectable,
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
				<Browser sourceID={sourceID} filter={filter} selectable={selectable}
					onClose={this.onCancel}
					onSelectionChange={this.onSelectionChange}
					/>
				<DialogButtons buttons={buttons}/>
			</div>
		);
	}
}
