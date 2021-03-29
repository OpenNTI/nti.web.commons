const elements = {};
const specials = {
	dangerouslySetInnerHTML: 1,
};
const isData = RegExp.prototype.test.bind(/^data-/i);

export function filterProps(props, cmp) {
	if (typeof cmp !== 'string') {
		return props;
	}
	if (!(cmp in elements)) {
		elements[cmp] = document.createElement(cmp);
	}

	const filtered = {};

	for (const prop of Object.keys(props)) {
		if (
			isData(prop) ||
			prop in elements[cmp] ||
			prop in specials ||
			prop.toLowerCase() in elements[cmp] ||
			prop === 'dangerouslySetInnerHTML' ||
			prop === 'children'
		) {
			filtered[prop] = props[prop];
		}
	}

	return filtered;
}
