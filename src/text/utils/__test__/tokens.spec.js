export function buildMockToken (word) {
	const token = document.createElement('span');

	token.innerHTML = word;
	token.setAttribute('nti-word-token', 'true');

	return token;
}