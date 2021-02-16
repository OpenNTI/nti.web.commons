export default function isInBeforeBuffer(
	top,
	height,
	scrollTop,
	clientHeight,
	buffer
) {
	const bottom = top + height;
	const screenBottom = scrollTop + clientHeight;

	return bottom < screenBottom && bottom > scrollTop - clientHeight * buffer;
}
