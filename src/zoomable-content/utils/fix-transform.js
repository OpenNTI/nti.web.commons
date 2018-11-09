// import {Matrix} from '@nti/lib-whiteboard';


const FIXERS = [
	//placement
	(transform) => transform
];

export default function fixTransform (transform, constraints) {
	if (!transform || !constraints) { return transform; }

	return FIXERS.reduce((fixed, fixer) => {
		return fixer(fixed, constraints);
	}, transform);
}
