import './RemoveButton.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

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
			<div
				className={cx('nt-remove-button', this.props.className)}
				onClick={this.onClick}
			>
				<i className="icon-remove" />
			</div>
		);
	}
}
