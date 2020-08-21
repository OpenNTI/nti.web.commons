import './ActionHeader.scss';
import React from 'react';
import PropTypes from 'prop-types';

class ActionHeader extends React.Component {
	static propTypes = {
		cancel: PropTypes.string.isRequired,
		save: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		onCancel: PropTypes.func.isRequired,
		onSave: PropTypes.func.isRequired
	}

	render () {
		const { cancel, title, save, onCancel, onSave } = this.props;
		return (
			<div className="action-header">
				<div className="action-cancel" onClick={onCancel}>{cancel}</div>
				<div className="action-title">{title}</div>
				<div className="action-save" onClick={onSave}>{save}</div>
			</div>
		);
	}
}

export default ActionHeader;
