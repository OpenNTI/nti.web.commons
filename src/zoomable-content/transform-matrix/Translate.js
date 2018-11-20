import {
	getIdentity,
	getRectOfTransform,
	multiply,
	translate
} from './utils';

function doTransform (matrix, x, y) {
	let newMatrix = getIdentity();

	newMatrix = translate(newMatrix, x, y);
	newMatrix = multiply(newMatrix, matrix);

	return newMatrix;
}

function offsetForHorizontalConstraints (x, newRect, oldRect, boundarySize) {
	if (newRect.left === oldRect.left) { return 0; }//if we aren't moving horizontally don't correct it

	const movingLeft = newRect.left < oldRect.left;
	const movingRight = newRect.left > oldRect.left;

	const hasLeftOverhang = newRect.left < 0;
	const hasRightOverhang = newRect.right > boundarySize.width;

	let offset = 0;

	if (movingLeft && !hasRightOverhang) { offset = -x; }
	if (movingRight && !hasLeftOverhang) { offset = -x; }

	return offset;
}


function offsetForVerticalConstraints (y, newRect, oldRect, boundarySize) {
	if (newRect.top === oldRect.top) { return 0; }//if we aren't moving horizontally don't correct it

	const movingUp = newRect.top < oldRect.top;
	const movingDown = newRect.top > oldRect.top;

	const hasTopOverhang = newRect.top < 0;
	const hasBottomOverhang = newRect.bottom > boundarySize.height;

	let offset = 0;

	if (movingUp && !hasBottomOverhang) { offset = -y; }
	if (movingDown && !hasTopOverhang) { offset = -y;}

	return offset;
}


function fitToConstraints (matrix, oldMatrix, x, y, {contentSize, boundarySize}) {
	if (!contentSize || !boundarySize) { return matrix; }

	const newRect = getRectOfTransform(matrix, contentSize);
	const oldRect = getRectOfTransform(oldMatrix, contentSize);

	let offsetX = offsetForHorizontalConstraints(x, newRect, oldRect, boundarySize);
	let offsetY = offsetForVerticalConstraints(y, newRect, oldRect, boundarySize);

	return offsetX || offsetY ? doTransform(matrix, offsetX, offsetY) : matrix;
}


function apply (matrix, x, y, constraints = {}) {
	const newMatrix = doTransform(matrix, x, y);

	return fitToConstraints(newMatrix, matrix, x, y, constraints);
}


export default {
	apply,
	get: (matrix) => translate.get(matrix)
};
