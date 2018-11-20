import {getIdentity, multiply, translate} from './utils';

const Translate = {
	apply (matrix, x, y, constraints) {
		let newMatrix = getIdentity();

		newMatrix = translate(newMatrix, x, y);
		newMatrix = multiply(newMatrix, matrix);

		return newMatrix;
	},


	get (matrix) {
		return [matrix[4], matrix[5]];
	}
};

export default Translate;
