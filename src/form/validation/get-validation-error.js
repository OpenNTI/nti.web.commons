import {scoped} from '@nti/lib-locale';

const t = scoped('nti-web-commons.form.validation.get-validation-error', {
	missing: 'Please fill out this field.',
	invalidEmail: 'Please provide a valid email.'
});

const checks = [
	{message: t('missing'), check: field => field.required && field.validity.valueMissing},
	{message: t('invalidEmail'), check: field => field.type === 'email' && field.validity.typeMismatch}
];

export default function getValidationError (field) {
	for (let check of checks) {
		if (check.check(field)) { return check.message; }
	}
}