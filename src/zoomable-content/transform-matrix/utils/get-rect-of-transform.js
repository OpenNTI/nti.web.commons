import scale from './scale';
import translate from './translate';

export default function getRectOfTransform (matrix, contentSize) {
	//if we don't have the original content size we can't get the rect...
	if (!contentSize) { return null; }

	const [scaleX, scaleY] = scale.get(matrix);
	const [x, y] = translate.get(matrix);

	const width = contentSize.width * scaleX;
	const height = contentSize.height * scaleY;

	return {
		top: y,
		left: x,
		right: x + width,
		bottom: y + height,
		width,
		height
	};
}
