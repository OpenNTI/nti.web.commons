const elements = {};

export function filterProps (props, cmp) {
	if (typeof cmp !== 'string') { return props; }
	if (!(cmp in elements)) {
		elements[cmp] = document.createElement(cmp);
	}

	const filtered = {};

	for (const prop of Object.keys(props)) {
		if (prop in elements[cmp]) {
			filtered[prop] = props[prop];
		}
	}

	return filtered;
}
