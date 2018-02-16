//an anchor can be anything that is below the top of the screen
export default function isPossibleAnchor (top, height, scrollTop, clientHeight) {
	return top >= scrollTop && top <= (scrollTop + clientHeight) ||
		top <= scrollTop && (top + height) > (scrollTop + clientHeight);
}
