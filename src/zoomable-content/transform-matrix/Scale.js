import {getIdentity, multiply, scale, translate} from './utils';
import Translate from './Translate';

const Scale = {
	apply (matrix, value, around, constraints) {
		let newMatrix = getIdentity();

		if (around) {
			newMatrix = translate(newMatrix, around.x, around.y);
			newMatrix = scale(newMatrix, value);
			newMatrix = translate(newMatrix, -around.x, -around.y);
		} else {
			newMatrix = scale(newMatrix, value);
		}

		newMatrix = multiply(newMatrix, matrix);

		if (!Scale.isValid(newMatrix, constraints)) {
			return Scale.fitToConstraints(matrix, constraints);
		}

		return Scale.fitToConstraints(newMatrix, constraints);
	},


	getAsScalar (matrix) {
		const [sx, sy] = Scale.get(matrix);

		return (sx + sy) / 2;
	},


	get (matrix) {
		const [a, b, c, d] = matrix;

		return [
			Math.sqrt(a * a + b * b),
			Math.sqrt(c * c + d * d)
		];
	},


	isValid (matrix, {minScale, maxScale}) {
		const scaleValue = Scale.getAsScalar(matrix);
		let valid = true;

		if (minScale != null && maxScale != null) {
			valid = scaleValue >= minScale && scaleValue <= maxScale;
		} else if (minScale != null) {
			valid = scaleValue >= minScale;
		} else if (maxScale != null) {
			valid = scaleValue <= maxScale;
		}


		return valid;
	},


	fitToConstraints (matrix, {contentSize, boundrarySize, minScale}) {
		if (!contentSize || !boundrarySize || !minScale) { return matrix; }

		const scaleValue = Scale.getAsScalar(matrix);

		if (scaleValue !== minScale) { return matrix; }

		// const [oldX, oldY] = Translate.get(matrix);
		const newSize = {
			width: contentSize.width * scaleValue,
			height: contentSize.height * scaleValue
		};

		let offsetX = 0;
		let offsetY = 0;

		if (newSize.width < boundrarySize.width) {
			offsetX = (boundrarySize.width - newSize.width) / 2;
		}

		if (newSize.height < boundrarySize.height) {
			offsetY = (boundrarySize.height - newSize.height) / 2;
		}

		return offsetX || offsetY ? Translate.apply(matrix, offsetX, offsetY, {}) : matrix;
	}
};

export default Scale;
