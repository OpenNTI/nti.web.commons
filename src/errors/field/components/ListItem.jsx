import './ListItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class ErrorListItem extends React.Component {
	static propTypes = {
		error: PropTypes.object.isRequired,
		isWarning: PropTypes.bool,
		onErrorFocus: PropTypes.func,
	};

	onClick = () => {
		const { error, onErrorFocus } = this.props;

		if (error && error.focus) {
			error.focus();

			if (onErrorFocus) {
				onErrorFocus();
			}
		}
	};

	render() {
		const { error, isWarning } = this.props;
		const { attachedTo, message } = error;
		const { label } = attachedTo;
		const cls = cx('nti-error-list-item', { warning: isWarning });

		return (
			<div className={cls}>
				{label && (
					<span className="label" onClick={this.onClick}>
						{label}
					</span>
				)}
				<span className="message">{message}</span>
			</div>
		);
	}
}
