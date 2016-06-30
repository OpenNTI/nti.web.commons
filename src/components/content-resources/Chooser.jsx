import React from 'react';
import Browser from './Browser';
import DialogButtons from '../DialogButtons';

import {modal} from '../../prompts';

export default class Chooser extends React.Component {
	static propTypes = {
		filter: React.PropTypes.func,
		sourceID: React.PropTypes.string,
		onCancel: React.PropTypes.func,
		onDismiss: React.PropTypes.func,
		onSelect: React.PropTypes.func,
		selectButtonLabel: React.PropTypes.string
	}


	static show (sourceID, filter, verb) {
		return new Promise((select, reject) => {
			modal(
				<Chooser sourceID={sourceID}
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


	onSelect = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const {onSelect} = this.props;

		if (onSelect) {
			onSelect();
		}
		this.dismiss();
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
			filter,
			sourceID,
			selectButtonLabel
		} = this.props;

		const buttons = [
			{
				label: 'Cancel',
				className: 'cancel',
				onClick: this.onCancel
			},
			{
				label: selectButtonLabel || 'Select',
				onClick: this.onSelect
			}
		];

		return (
			<div className="content-resource-chooser">
				<Browser sourceID={sourceID} fiter={filter} onClose={this.onCancel}/>
				<DialogButtons buttons={buttons}/>
			</div>
		);
	}
}
