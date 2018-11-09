export default function isValidTransform (transform, constraints) {
	if (!transform || !constraints) { return transform; }

	const {contentSize, frameSize, maxScale} = constraints;
	const scale = transform.getScaleAsScaler();

	if (scale > maxScale) {
		return false;
	}

	const newSize = {
		width: contentSize.width * scale,
		height: contentSize.height * scale
	};

	if (newSize.width < frameSize.width && newSize.height < frameSize.height) { return false;}


	return true;

}
