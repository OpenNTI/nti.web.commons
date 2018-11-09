import {Matrix} from '@nti/lib-whiteboard';

export function getFrom (transform) {
	const [x, y] = transform ? transform.getTranslation() : [0, 0];

	return {x, y};
}

export function setOn (transform, x, y) {
	const newTransform = new Matrix();

	newTransform.translate(x, y);
	newTransform.multiply(transform);

	return newTransform;
}
