const STYLE_GETTERS = {
	width: (node) => `${Math.ceil(node.getBoundingClientRect().width)}px`,
	height: (node) => `${Math.ceil(node.getBoundingClientRect().height)}px`
};

export default function getMirrorStyles (node, styles) {
	const computedStyles = global.getComputedStyle ? global.getComputedStyle(node) : {};

	return styles.reduce((acc, style) => {
		const getter = STYLE_GETTERS[style];

		return {...acc, [style]: (getter ? getter(node, computedStyles) : computedStyles[style])};
	}, {});
}