import useMatchesMediaQuery from './use-matches-media-query';

const {MobileQuery, TabletQuery, DesktopQuery} = useMatchesMediaQuery;

export function useResponsiveValue (query, matchValue, noMatchValue) {
	const matches = useMatchesMediaQuery(query);

	return matches ? matchValue : noMatchValue;
}

export const useMobileValue = (...args) => useResponsiveValue(MobileQuery, ...args);
export const useTabletValue = (...args) => useResponsiveValue(TabletQuery, ...args);
export const useDestktopValue = (...args) => useResponsiveValue(DesktopQuery, ...args);
