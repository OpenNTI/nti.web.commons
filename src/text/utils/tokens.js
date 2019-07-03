//https://stackoverflow.com/questions/8609170/how-to-wrap-each-word-of-an-element-in-a-span-tag/50135988#50135988
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