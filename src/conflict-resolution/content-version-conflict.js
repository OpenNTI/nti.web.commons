
import { modal } from '../prompts';

import ContentVersionConflictPrompt from './components/ContentVersionConflictPrompt';

export const Code = 'ContentVersionConflictError';

export default function contentVersionConflictHandler(challenge) {
	return new Promise((confirm, reject) => {
		modal(
			<ContentVersionConflictPrompt
				challenge={challenge}
				onConfirm={confirm}
				onCancel={reject}
			/>,
			{
				className: 'request-conflict-resolver',
				restoreScroll: true,
			}
		);
	}).then(
		(...args) => challenge.confirm(...args),
		() => challenge.reject()
	);
}
