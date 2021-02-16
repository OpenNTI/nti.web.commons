function defaultMatch(value, display) {
	return match => {
		return match === value || (display && display === match);
	};
}

export default function createToken(
	value,
	display,
	isExactMatch,
	wasRaw,
	tokenId
) {
	return {
		value,
		tokenId: tokenId || value,
		display: display || value,
		isExactMatch: isExactMatch || defaultMatch(value, display),
		isSameToken: token => token.isExactMatch(value),
		wasRaw,
	};
}
