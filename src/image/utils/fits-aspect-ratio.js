//aspect: w / h
export default function fitsAspectRatio(image, aspectRatio) {
	if (!image) {
		return false;
	}

	const { naturalWidth: width, naturalHeight: height } = image;
	const actual = width / height;

	const fittedHeight = width / aspectRatio;
	const heightDelta = Math.abs(fittedHeight - height);

	return actual === aspectRatio || heightDelta < 1;
}
