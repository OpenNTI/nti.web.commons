import React from 'react';

import useForceUpdate from './use-force-update';

useMediaQuery.MobileQuery = '(max-width: 480px)';
useMediaQuery.TabletQuery = '(min-width: 481px) and (max-width: 1024px)';
useMediaQuery.DesktopQuery = '(min-width: 2015px)';

export function useMediaQuery (query) {
	const forceUpdate = useForceUpdate();
	const mediaQuery = React.useMemo(() => global.matchMedia(query), [query]);

	React.useEffect(() => {
		mediaQuery.addEventListener('change', forceUpdate);
		return () => mediaQuery.removeEventListener('change', forceUpdate);
	}, [mediaQuery]);

	return mediaQuery;
}
