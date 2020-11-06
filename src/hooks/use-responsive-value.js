import useMatchesMediaQuery from './use-matches-media-query';

export default function useResponsiveValue (query, matchValue, noMatchValue) {
	const matches = useMatchesMediaQuery(query);

	return matches ? matchValue : noMatchValue;
}
