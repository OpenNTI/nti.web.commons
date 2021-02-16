import './RemoveButton.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { areYouSure } from '../prompts/';

export default class RemoveButton extends React.Component {
	static propTypes = {
		onRemove: PropTypes.func.isRequired,
		confirmationMessage: PropTypes.string,
	};

	onClick = e => {
		e.preventDefault();
		e.stopPropagation();

		const { onRemove, confirmationMessage } = this.props;

		if (confirmationMessage) {
			areYouSure(confirmationMessage).then(() => {
				onRemove && onRemove();
			});
		} else {
			onRemove && onRemove();
		}
	};

	render() {
		return (
			<div className="nt-remove-button" onClick={this.onClick}>
				<i className="icon-remove" />
			</div>
		);
	}
}
