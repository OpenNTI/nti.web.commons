export default function isSameOptions (a, b) {
	if (a.length !== b.length) { return false; }

	for (let i = 0; i < a.length; i++) {
		const aOption = a[i];
		const bOption = b[i];

		const {value:aVal, removable:aRemovable} = aOption.props;
		const {value:bVal, removable:bRemovable} = bOption.props;

		if (aVal !== bVal || aRemovable !== bRemovable) {
			return false;
		}
	}

	return true;
}
