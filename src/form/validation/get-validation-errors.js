import getValidationError from './get-validation-error';

export default function getValidationErrors(form) {
	const invalid = Array.from(form.querySelectorAll(':invalid'));

	if (!invalid || !invalid.length) {
		return null;
	}

	return invalid.reduce((acc, field) => {
		const error = getValidationError(field);

		acc[field.name] = error;

		return acc;
	}, {});
}
