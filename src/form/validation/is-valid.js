export default function isValid (form) {
	const invalid = Array.from(form.querySelectorAll(':invalid'));

	return !invalid || !invalid.length;
}