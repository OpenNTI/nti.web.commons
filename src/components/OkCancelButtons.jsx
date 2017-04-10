import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';

const t = scoped('BUTTONS');

export default React.createClass({
	displayName: 'OkCancelButtons',

	propTypes: {
		cancelText: PropTypes.string,
		okText: PropTypes.string,

		onCancel: PropTypes.func,
		onOk: PropTypes.func.isRequired,
		okEnabled: PropTypes.bool
	},

	getDefaultProps () {
		return {
			okEnabled: true
		};
	},

	onCancel (event) {
		this.killEvent(event);
		this.props.onCancel(event);
	},

	onConfirm (event) {
		this.killEvent(event);
		this.props.onOk(event);
	},

	killEvent (event) {
		event.preventDefault();
		event.stopPropagation();
	},

	render () {

		return (
			<div className="buttons">
				{this.props.onCancel &&
					<a href="#"
						onClick={this.onCancel}
						className="cancel button">{this.props.cancelText || t('cancel')}</a>
				}

				<a href="#"
					onClick={this.props.okEnabled ? this.onConfirm : this.killEvent}
					disabled={!this.props.okEnabled}
					className="confirm button">{this.props.okText || t('ok')}</a>
			</div>
		);
	}

});
