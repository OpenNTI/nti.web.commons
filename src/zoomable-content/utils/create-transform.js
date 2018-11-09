import {Matrix} from '@nti/lib-whiteboard';

export default function createTransform (transforms) {
	const {scale, translate} = transforms || {};
	const transform = new Matrix();

	if (translate != null) {
		transform.translate(translate.x || 0, translate.y || 0);
	}

	if (scale != null) {
		transform.scale(scale);
	}

	return transform;
}
