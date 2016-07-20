import React, {PropTypes} from 'react';
import DialogButtons from '../../components/DialogButtons';

const NOOP = () => {};

DefaultConfirmPrompt.propTypes = {
	challenge: PropTypes.object,
	onDismiss: PropTypes.func,
	onConfirm: PropTypes.func,
	onCancel: PropTypes.func
};


export default function DefaultConfirmPrompt ({
	challenge,
	onDismiss = NOOP,
	onConfirm = NOOP,
	onCancel = NOOP
}) {

	function onConfirmClick () {
		onConfirm();
		onDismiss();
	}

	function onCancelClick () {
		onCancel();
		onDismiss();
	}

	const buttons = [
		{
			className: 'cancel',
			label: 'Cancel',
			onClick: onCancelClick
		},
		{
			className: 'caution confirm',
			label: 'Confirm',
			onClick: onConfirmClick
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
