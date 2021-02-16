import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';

const DEFAULT_TEXT = {
	ok: 'Okay',
	cancel: 'Cancel',
	save: 'Save',
	post: 'Post',
};

const t = scoped('common.components.buttons', DEFAULT_TEXT);

export default class extends React.Component {
	static displayName = 'OkCancelButtons';

	static propTypes = {
		cancelText: PropTypes.string,
		okText: PropTypes.string,

		onCancel: PropTypes.func,
		onOk: PropTypes.func.isRequired,
		okEnabled: PropTypes.bool,
	};

	static defaultProps = {
		okEnabled: true,
	};

	onCancel = event => {
		this.killEvent(event);
		this.props.onCancel(event);
	};

	onConfirm = event => {
		this.killEvent(event);
		this.props.onOk(event);
	};

	killEvent = event => {
		event.preventDefault();
		event.stopPropagation();
	};

	render() {
		return (
			<div className="buttons">
				{this.props.onCancel && (
					<a
						href="#"
						onClick={this.onCancel}
						className="cancel button"
					>
						{this.props.cancelText || t('cancel')}
					</a>
				)}

				<a
					href="#"
					onClick={
						this.props.okEnabled ? this.onConfirm : this.killEvent
					}
					disabled={!this.props.okEnabled}
					className="confirm button"
				>
					{this.props.okText || t('ok')}
				</a>
			</div>
		);
	}
}
