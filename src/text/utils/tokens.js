const TOKEN_REGEX = /(^|<\/?[^>]+>|\s+)([^\s<]+)/g;
const TOKEN_ATTRIBUTE = 'nti-word-token';

export function isTokenized (text) {
	return text.indexOf(TOKEN_ATTRIBUTE) >= 0;
}

export function tokenizeText (text) {
	if (isTokenized(text)) { return text; }

	return text.replace(TOKEN_REGEX, `$1<span ${TOKEN_ATTRIBUTE}="true">$2</span>`);
}

export function getTokensFromNode (node) {
	const tokens = node.querySelectorAll(`[${TOKEN_ATTRIBUTE}]`);

	return Array.from(tokens);
}