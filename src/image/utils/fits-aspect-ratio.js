//aspect: w / h
export default function fitsAspectRatio (image, aspectRatio) {
	if (!image) { return false; }

	const {naturalWidth: width, natrualHeight: height} = image;

	return (width / height) === aspectRatio;
}