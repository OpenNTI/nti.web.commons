export default function isEqual (a, b) {
	if (!Array.isArray(a) || !Array.isArray(b)) { return false; }
	if (a.length !== b.length) { return false; }

	return a.every((value, index) => b[index] === value);
}
