import {Matrix} from '@nti/lib-whiteboard';

// import {getFrom as getTranslation} from './translation';

export function getFrom (transform) {
	return transform ? transform.getScaleAsScaler() : 1;
}

export function setOn (transform, scale, around) {
	const newTransform = new Matrix();

	newTransform.translate(around.x, around.y);
	newTransform.scale(scale);
	newTransform.translate(-around.x, -around.y);
	newTransform.multiply(transform);

	return newTransform;
}
