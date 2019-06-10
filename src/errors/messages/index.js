import {scoped} from '@nti/lib-locale';

const t = scoped('common.errors.messages', {
	default: 'An error occurred.'
});

export function getMessage (error) {
	if (typeof error === 'string') { return error; }

	return error.Message || error.message || t('default');
}