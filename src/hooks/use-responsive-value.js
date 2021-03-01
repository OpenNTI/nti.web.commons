import { useMediaQuery } from './use-media-query';

const { MOBILE, TABLET, DESKTOP } = useMediaQuery;

export function useResponsiveValue(query, matchValue, noMatchValue) {
	const { matches } = useMediaQuery(query);

	return matches ? matchValue : noMatchValue;
}

export const useMobileValue = (...args) => useResponsiveValue(MOBILE, ...args);
export const useTabletValue = (...args) => useResponsiveValue(TABLET, ...args);
export const useDesktopValue = (...args) =>
	useResponsiveValue(DESKTOP, ...args);
