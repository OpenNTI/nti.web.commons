import multiply from './multiply';

export default function scale (matrix, value) {
	const sx = value.x != null ? value.x : value;
	const sy = value.y != null ? value.y : value;

	return multiply(matrix, [sx, 0, 0, sy, 0, 0]);
}
