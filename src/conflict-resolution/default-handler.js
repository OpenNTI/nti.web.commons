import React from 'react';
import {modal} from '../prompts';
import DefaultConfirmPrompt from './components/DefaultConfirmPrompt';

export default function defaultConflictHandler (challenge) {
	return new Promise(confirm => {
		modal(
			<DefaultConfirmPrompt challenge={challenge} onConfirm={confirm} />,
			'request-conflict-resolver'
		);
	})
		.then(() => challenge.confirm());
}
