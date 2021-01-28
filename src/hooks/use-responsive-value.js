import {useMediaQuery} from './use-media-query';

const {MobileQuery, TabletQuery, DesktopQuery} = useMediaQuery;

export function useResponsiveValue (query, matchValue, noMatchValue) {
	const {matches} = useMediaQuery(query);

	return matches ? matchValue : noMatchValue;
}

export const useMobileValue = (...args) => useResponsiveValue(MobileQuery, ...args);
export const useTabletValue = (...args) => useResponsiveValue(TabletQuery, ...args);
export const useDestktopValue = (...args) => useResponsiveValue(DesktopQuery, ...args);
