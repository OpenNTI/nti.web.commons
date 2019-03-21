export default function isSameOptions (a, b) {
	if (a.length !== b.length) { return false; }

	for (let i = 0; i < a.length; i++) {
		const aOption = a[i];
		const bOption = b[i];

		const {value:aVal, removable:aRemovable, checked:aChecked} = aOption.props;
		const {value:bVal, removable:bRemovable, checked:bChecked} = bOption.props;

		if (aVal !== bVal || aRemovable !== bRemovable || aChecked !== bChecked) {
			return false;
		}
	}

	return true;
}
