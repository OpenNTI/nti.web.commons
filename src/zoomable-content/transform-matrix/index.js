import {getIdentity, isEqual} from './utils';
import Output from './Output';
import Scale from './Scale';
import Translate from './Translate';


const MATRIX = Symbol('Matrix');

function isValidInput (input) {
	if (!input) { return true; }
	if (!Array.isArray(input)) { return false; }
	if (input.length !== 6) { return false; }

	return input.every(x => typeof x === 'number');
}

export default function TransformMatrix (input, constraints = {}) {
	if (!isValidInput(input)) {
		throw new Error('Invalid Transform Matrix');
	}

	const matrix = input ? [...input] : getIdentity();

	return {
		[MATRIX]: matrix,

		setMaxScale: scale => TransformMatrix(matrix, {...constraints, maxScale: scale}),
		setMinScale: scale => TransformMatrix(matrix, {...constraints, minScale: scale}),

		setContentSize: size => TransformMatrix(matrix, {...constraints, contentSize: size}),
		setBoundarySize: size => TransformMatrix(matrix, {...constraints, boundarySize: size}),

		isEqual: transform => isEqual(matrix, transform[MATRIX] || transform),

		scale: (value, around) => TransformMatrix(Scale.apply(matrix, value, around, constraints), constraints),
		getScaleAsScalar: () => Scale.getAsScalar(matrix),
		getScale: () => Scale.get(matrix),

		translate: (x, y) => TransformMatrix(Translate.apply(matrix, x, y, constraints), constraints),
		getTranslation: () => Translate.get(matrix),

		asCSSTransform: () => Output.asCSSTransform(matrix)
	};
}
