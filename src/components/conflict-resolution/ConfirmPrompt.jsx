import React, {PropTypes} from 'react';

export default function ConfirmPrompt ({onDismiss, challenge, onConfirm}) {
	function onClick () {
		onConfirm();
		onDismiss();
	}

	return (
		<div className="confirm-prompt">
			<div className="message">
				{challenge.message}
			</div>
			<div className="buttons">
				<div className="button confirm" onClick={onClick}>Confirm</div>
				<div className="button cancel" onClick={onDismiss}>Cancel</div>
			</div>
		</div>
	);
}


ConfirmPrompt.propTypes = {
	onDismiss: PropTypes.func,
	onConfirm: PropTypes.func,
	challenge: PropTypes.object
};
