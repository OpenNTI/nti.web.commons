export default function getStyleFor (transform) {
	if (!transform) {
		return {
			WebkitTransform: 'none',
			transform: 'none',
			WebkitTransformOrigin: '0 0',
			transformOrigin: '0 0'
		};
	}

	const {a, b, c, d, tx, ty} = transform.toTransform();
	const cssTransform = `matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})`;

	return {
		WebkitTransform: cssTransform,
		transform: cssTransform,
		WebkitTransformOrigin: '0 0',
		transformOrigin: '0 0'
	};
}
