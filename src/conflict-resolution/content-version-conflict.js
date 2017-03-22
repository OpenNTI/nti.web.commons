import React from 'react';

import {modal} from '../prompts';

import ContentVersionConflictPrompt from './components/ContentVersionConflictPrompt';

export const Code = 'ContentVersionConflictError';

export default function contentVersionConflictHandler (challenge) {
	return new Promise((confirm, reject) => {
		modal(
			<ContentVersionConflictPrompt challenge={challenge} onConfirm={confirm} onCancel={reject} />,
			'request-conflict-resolver'
		);
	})
		.then((...args) => challenge.confirm(...args), () => challenge.reject());
}

