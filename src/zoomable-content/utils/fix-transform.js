import * as Scale from './scale';
import * as Translation from './translation';

function getNewPositionAndSize (transform, constraints) {
	const {contentSize} = constraints;
	const scale = Scale.getFrom(transform);

	const {x: newX, y: newY} = Translation.getFrom(transform);
	const newSize = {
		width: contentSize.width * scale,
		height: contentSize.height * scale
	};

	return {
		newX,
		newY,
		newSize
	};
}


const FIXERS = [
	//Don't show whitespace before or after the content if its big enough to fill the frame
	(transform, constraints) => {
		const {frameSize} = constraints;
		const {newX, newY, newSize} = getNewPositionAndSize(transform, constraints);
		const newRight = newX + newSize.width;
		const newBottom = newY + newSize.height;

		let offsetX = 0;
		let offsetY = 0;

		if (newSize.width < frameSize.width) {
			offsetX = ((frameSize.width / 2) - (newSize.width / 2)) - newX;
		}
		// else if (newSize.width >= frameSize.width) {
		// 	if (newX < 0) { offsetX = -newX; }
		// 	if (newRight < frameSize.width) { offsetX = frameSize.width - newRight; }
		// }

		if (newSize.height < frameSize.height) {
			offsetY = ((frameSize.height / 2) - (newSize.height / 2)) - newY;
		}
		// else if (newSize.height > frameSize.height) {
		// 	if (newY < 0) {offsetY = -newY; }
		// 	if (newBottom > frameSize.height) { offsetY = frameSize.height - newBottom; }
		// }

		return offsetX || offsetY ? Translation.setOn(transform, offsetX, offsetY) : transform;
	},


	//If the content is smaller than the frame, don't let any of the smaller side be out of frame
	// (transform, constraints) => {
	// 	const {frameSize} = constraints;
	// 	const {newX, newY, newSize} = getNewPositionAndSize(transform, constraints);

	// 	if (newSize.width >= frameSize.width && newSize.height >= frameSize.height) { return transform; }

	// 	let offsetX = 0;
	// 	let offsetY = 0;


	// 	if (newSize.width < frameSize.width) {
	// 		offsetX = ((frameSize.width / 2) - (newSize.width / 2)) - newX;
	// 	}

	// 	if (newSize.height < frameSize.height) {
	// 		offsetY = ((frameSize.height / 2) - (newSize.height / 2)) - newY;
	// 	}

	// 	return offsetX || offsetY ? Translation.setOn(transform, offsetX, offsetY) : transform;
	// }
];

export default function fixTransform (transform, constraints) {
	if (!transform || !constraints) { return transform; }

	return FIXERS.reduce((fixed, fixer) => {
		return fixer(fixed, constraints);
	}, transform);
}
