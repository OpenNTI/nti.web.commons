import multiply from './multiply';


translate.get = matrix => ([matrix[4], matrix[5]]);
export default function translate (matrix, x, y) {
	if (Array.isArray(x)) {
		[x, y] = x;
	}

	return multiply(matrix, [1, 0, 0, 1, x, y]);
}
