export default function isValid(form) {
	if (!form) {
		return true;
	}

	const invalid = Array.from(form.querySelectorAll(':invalid'));

	return !invalid || !invalid.length;
}
