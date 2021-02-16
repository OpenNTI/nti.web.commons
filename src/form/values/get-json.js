const Default = Symbol('Default');
const ValueGetters = {
	[Default]: f => f.value,
	checkbox: f => f.checked,
};

export default function getJSON(form) {
	if (!form) {
		return null;
	}

	const fields = Array.from(form.elements);

	return fields.reduce((acc, field) => {
		if (field.name) {
			acc[field.name] = ValueGetters[field.type]
				? ValueGetters[field.type](field)
				: ValueGetters[Default](field);
		}

		return acc;
	}, {});
}
