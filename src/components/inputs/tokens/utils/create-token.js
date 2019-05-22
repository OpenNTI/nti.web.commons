export default function createToken (value, display, isExactMatch, wasRaw) {
	return {
		value,
		display: display || value,
		isExactMatch: isExactMatch || ((match) => (match === value || (display && match === display))),
		isSameToken: (token) => token.isExactMatch(value),
		wasRaw
	};
}
