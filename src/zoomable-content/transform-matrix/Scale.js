import {
	getIdentity,
	multiply,
	scale,
	translate
} from './utils';


function scaleToMinAndCenter (matrix, {minScale, contentSize, boundarySize}) {
	if (!contentSize || !boundarySize) { return matrix; }

	const newSize = {
		width: contentSize.width * minScale,
		height: contentSize.height * minScale
	};
	const newPosition = {
		x: (boundarySize.width / 2) - (newSize.width / 2),
		y: (boundarySize.height / 2) - (newSize.height / 2)

	};

	let newMatrix = getIdentity();

	newMatrix = translate(newMatrix, newPosition.x, newPosition.y);

	newMatrix = scale(newMatrix, minScale);

	return newMatrix;
}


function fitToConstraints (newMatrix, oldMatrix, constraints) {
	const {minScale, maxScale} = constraints;
	const scaleValue = scale.getAsScalar(newMatrix);

	if (minScale != null && scaleValue <= minScale) { return scaleToMinAndCenter(newMatrix, constraints); }
	if (maxScale != null && scaleValue > maxScale) { return oldMatrix; }

	return newMatrix;
}


function apply (matrix, value, around, constraints = {}) {
	let newMatrix = getIdentity();

	if (around) {
		newMatrix = translate(newMatrix, around.x, around.y);
		newMatrix = scale(newMatrix, value);
		newMatrix = translate(newMatrix, -around.x, -around.y);
	} else {
		newMatrix = scale(newMatrix, value);
	}

	newMatrix = multiply(newMatrix, matrix);

	return fitToConstraints(newMatrix, matrix, constraints);
}


export default {
	apply,
	getAsScalar: matrix => scale.getAsScalar(matrix),
	get: matrix => scale.get(matrix)
};
