export default function isInAfterBuffer (top, height, scrollTop, clientHeight, buffer) {
	return top > scrollTop && top < scrollTop + (clientHeight * (buffer + 2));
}
