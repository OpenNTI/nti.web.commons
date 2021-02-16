import lineHeight from 'line-height';

function getComputedStyleValue(node, key) {
	const computed = global.getComputedStyle
		? global.getComputedStyle(node)
		: {};
	const value = computed[key];

	return Math.round(parseFloat(value, 10));
}

const GETTERS = {
	lineHeight: node => lineHeight(node),
	paddingTop: node => getComputedStyleValue(node, 'padding-top'),
	paddingBottom: node => getComputedStyleValue(node, 'padding-bottom'),
};

export default function getComputedStyles(node, styles) {
	const computed = {};

	for (let style of styles) {
		const getter = GETTERS[style];

		if (getter) {
			computed[style] = getter(node);
		}
	}

	return computed;
}
