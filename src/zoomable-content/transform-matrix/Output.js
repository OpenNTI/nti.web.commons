export default {
	asCSSTransform (matrix) {
		const [a, b, c, d, tx, ty] = matrix;
		const cssTransform = `matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})`;

		return {
			WebkitTransform: cssTransform,
			transform: cssTransform,
			WebkitTransformOrigin: '0 0',
			transformOrigin: '0 0'
		};
	}
};
