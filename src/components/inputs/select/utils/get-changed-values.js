export default function getChangedValues (values, oldValues) {
	if (!oldValues) { return new Set(); }

	const newSet = new Set(values);
	const oldSet = new Set(oldValues);

	const added = values.filter(value => !oldSet.has(value));
	const removed = oldValues.filter(value => !newSet.has(value));

	return new Set([...added, ...removed]);
}
