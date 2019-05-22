import createToken from './create-token';

export default function cleanTokens (tokens) {
	return tokens.map((token) => {
		return typeof token === 'string' ? createToken(token, null, null, true) : token;
	});
}
