import {scoped} from '@nti/lib-locale';

const t = scoped('nti-web-commons.form.validation.get-validation-error', {
	missing: 'Please fill out this field.',
	invalidEmail: 'Please provide a valid email.',
	patternMismatch: 'Please match the requested format'
});

const checks = [
	{message: (field) => field.dataset.missingMessage ?? t('missing'), check: field => field.required && field.validity.valueMissing},
	{message: (field) => field.dataset.invalidEmailMessage ?? t('invalidEmail'), check: field => field.type === 'email' && field.validity.typeMismatch},
	{message: (field) => field.dataset.patternMismatchMessage ?? t('patternMismatch'), check: field => field.validity.patternMismatch}
];

export default function getValidationError (field) {
	for (let check of checks) {
		if (check.check(field)) {
			return check.message(field);
		}
	}
	return field.validationMessage;
}
