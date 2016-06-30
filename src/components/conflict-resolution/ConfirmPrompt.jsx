import React, {PropTypes} from 'react';
import DialogButtons from '../DialogButtons';


ConfirmPrompt.propTypes = {
	onDismiss: PropTypes.func,
	onConfirm: PropTypes.func,
	challenge: PropTypes.object
};


export default function ConfirmPrompt ({onDismiss, challenge, onConfirm}) {
	function onClick () {
		onConfirm();
		onDismiss();
	}

	const buttons = [
		{
			className: 'cancel',
			label: 'Cancel',
			onClick: onDismiss
		},
		{
			className: 'confirm',
			label: 'Confirm',
			onClick
		}
	];

	return (
		<div className="confirm-prompt">
			<div className="message">
				{challenge.message}
			</div>
			<DialogButtons buttons={buttons}/>
		</div>
	);
}
