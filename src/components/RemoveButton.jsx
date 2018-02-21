import React from 'react';
import PropTypes from 'prop-types';

import {areYouSure} from '../prompts/';


export default class RemoveButton extends React.Component {
	static propTypes = {
		onDelete: PropTypes.func.isRequired,
		confirmationMessage: PropTypes.string
	};


	onClick = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const {onDelete, confirmationMessage} = this.props;

		if(confirmationMessage) {
			areYouSure(confirmationMessage).then(() => {
				onDelete && onDelete();
			});
		}
		else {
			onDelete && onDelete();
		}
	};


	render () {
		return (
			<div className="nt-remove-button" onClick={this.onClick}><i className="icon-remove"/></div>
		);
	}
}
