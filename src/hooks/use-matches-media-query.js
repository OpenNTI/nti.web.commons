import React from 'react';

import useForceUpdate from './use-force-update';

useMatchesMediaQuery.MobileQuery = '(max-width: 480px)';
useMatchesMediaQuery.TabletQuery = '(min-width: 481px) and (max-width: 1024px)';
useMatchesMediaQuery.DesktopQuery = '(min-width: 2015px)';

export default function useMatchesMediaQuery (query) {
	const forceUpdate = useForceUpdate();
	const mediaQuery = React.useMemo(() => global.matchMedia(query), [query]);

	React.useEffect(() => {
		mediaQuery.addEventListener('change', forceUpdate);
		return () => mediaQuery.removeEventListener('change', forceUpdate);
	}, [mediaQuery]);

	return mediaQuery.matches;
}
