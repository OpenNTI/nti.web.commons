export default function getLimitingSize (frameSize, contentSize) {
	const widthDiff = contentSize.width - frameSize.width;
	const heightDiff = contentSize.height - frameSize.height;

	if (widthDiff <= 0 && heightDiff <= 0) { return null; }

	return widthDiff >= heightDiff ? 'width' : 'height';
}
