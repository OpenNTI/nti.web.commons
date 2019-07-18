const STYLE_GETTERS = {
	width: (node) => `${node.clientWidth}px`,
	height: (node) => `${node.clientHeight}px`
};

export default function getMirrorStyles (node, styles) {
	const computedStyles = global.getComputedStyle ? global.getComputedStyle(node) : {};

	return styles.reduce((acc, style) => {
		const getter = STYLE_GETTERS[style];

		return {...acc, [style]: (getter ? getter(node, computedStyles) : computedStyles[style])};
	}, {});
}