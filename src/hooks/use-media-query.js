import React from 'react';

import { useForceUpdate } from './use-force-update';

const BREAK = {
	minimum: 360,
	handheld: 800,
	small: 900,
	large: 1200,
	wide: 1600,
	short: 600,
};

Object.assign(useMediaQuery, {
	MOBILE: '(max-width: 480px)',
	TABLET: `
		(min-width: 481px) and
		(max-width: 1024px)`,
	DESKTOP: '(min-width: 2015px)',

	// these mirror the custom media queries in variables.css (and legacy mixin.scss respond-to)
	SMALLEST_HANDHELDS: `(max-width: ${BREAK.minimum})`,
	HANDHELDS: `(max-width: ${BREAK.handheld})`,
	SMALL_SCREENS: `(max-width: ${BREAK.small})`,
	MEDIUM_SCREENS: `
		(min-width: ${BREAK.small + 1}) and
		(max-width: ${BREAK.large - 1})`,
	WIDE_SCREENS: `
		(min-width: ${BREAK.large}) and
		(max-width: ${BREAK.wide})`,
	ULTRA_WIDE_SCREENS: `(min-width: ${BREAK.wide + 1})`,
	UP_TO_MEDIUM_SCREENS: `(max-width: ${BREAK.large})`,
	UP_TO_WIDE_SCREENS: `(max-width: ${BREAK.wide})`,
	DOWN_TO_HANDHELDS: `(min-width: ${BREAK.handheld + 1})`,
	SHORT_SCREENS: `(max-height: ${BREAK.short})`,
});

export function useMediaQuery(query) {
	const key = query?.toUpperCase().replace(/-/g, '_');
	if (typeof useMediaQuery[key] === 'string') {
		query = useMediaQuery[key];
	}

	// This isn't really required but to help weed out accidental shortcut names, I'm going to require all queries start with (
	if (query && !query.startsWith('(')) {
		throw new TypeError(`Invalid media query: ${query}`);
	}

	const forceUpdate = useForceUpdate();
	const mediaQuery = React.useMemo(() => global.matchMedia?.(query), [query]);

	React.useEffect(() => {
		if (mediaQuery?.addEventListener)
			mediaQuery?.addEventListener('change', forceUpdate);
		else mediaQuery?.addListener?.(forceUpdate);

		return () => {
			if (mediaQuery?.removeEventListener)
				mediaQuery?.removeEventListener('change', forceUpdate);
			else mediaQuery?.removeListener?.(forceUpdate);
		};
	}, [mediaQuery]);

	return mediaQuery;
}
