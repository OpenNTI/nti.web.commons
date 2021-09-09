import React from 'react';

import { useForceUpdate } from '@nti/web-core';

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
	SMALLEST_HANDHELDS: `(max-width: ${BREAK.minimum}px)`,
	HANDHELDS: `(max-width: ${BREAK.handheld}px)`,
	SMALL_SCREENS: `(max-width: ${BREAK.small}px)`,
	MEDIUM_SCREENS: `
		(min-width: ${BREAK.small + 1}px) and
		(max-width: ${BREAK.large - 1}px)`,
	WIDE_SCREENS: `
		(min-width: ${BREAK.large}px) and
		(max-width: ${BREAK.wide}px)`,
	ULTRA_WIDE_SCREENS: `(min-width: ${BREAK.wide + 1}px)`,
	UP_TO_MEDIUM_SCREENS: `(max-width: ${BREAK.large}px)`,
	UP_TO_WIDE_SCREENS: `(max-width: ${BREAK.wide}px)`,
	DOWN_TO_HANDHELDS: `(min-width: ${BREAK.handheld + 1}px)`,
	SHORT_SCREENS: `(max-height: ${BREAK.short}px)`,
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

	if (mediaQuery && mediaQuery.media !== query) {
		throw new Error(
			`Invalid media query, serialized query (${mediaQuery.media}) does not match input (${query})!`
		);
	}

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

	// Too many things assume this returns something... make it always return something.
	return mediaQuery || {};
}
