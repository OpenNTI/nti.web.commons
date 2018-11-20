import multiply from './multiply';


scale.get = (matrix) => {
	const [a, b, c, d] = matrix;

	return [
		Math.sqrt(a * a + b * b),
		Math.sqrt(c * c + d * d)
	];
};
scale.getAsScalar = (matrix) => {
	const [sx, sy] = scale.get(matrix);

	return (sx + sy) / 2;
};
export default function scale (matrix, value) {
	const sx = value.x != null ? value.x : value;
	const sy = value.y != null ? value.y : value;

	return multiply(matrix, [sx, 0, 0, sy, 0, 0]);
}
