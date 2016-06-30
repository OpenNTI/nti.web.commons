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
			className: 'caution confirm',
			label: 'Confirm',
			onClick
		}
	];

	return (
		<div className="confirm-prompt">
			<i className="icon-alert"/>
			<div className="message">
				<h3>Are you sure?</h3>
				{challenge.message}
			</div>
			<DialogButtons buttons={buttons}/>
		</div>
	);
}
