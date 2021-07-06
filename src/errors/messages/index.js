import { scoped } from '@nti/lib-locale';

const t = scoped('common.errors.messages', {
	default: 'An error occurred.',
});

export function getMessage(error) {
	if (typeof error === 'string' || !error) {
		return error;
	}

	return error.Message || error.message || t('default');
}

export function mapMessage(error, msg) {
	const mapped = new Error(msg);

	mapped.cause = error;
	mapped.field = error.field;

	return mapped;
}

export function isWarning(error) {
	return error?.isWarning;
}

export function makeWarning(error) {
	const message = getMessage(error);
	const warning = new Error(message);

	warning.isWarning = true;
	warning.cause = error;
	warning.field = error.field;

	return warning;
}
