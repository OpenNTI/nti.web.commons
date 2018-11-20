import multiply from './multiply';

export default function translate (matrix, x, y) {
	if (Array.isArray(x)) {
		[x, y] = x;
	}

	return multiply(matrix, [1, 0, 0, 1, x, y]);
}
