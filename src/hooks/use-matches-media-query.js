import React from 'react';

import useForceUpdate from './use-force-update';

export default function useMatchesMediaQuery (query) {
	const forceUpdate = useForceUpdate();
	const mediaQuery = React.useMemo(() => global.matchMedia(query), [query]);

	React.useEffect(() => {
		mediaQuery.addEventListener('change', forceUpdate);
		return () => mediaQuery.removeEventListener('change', forceUpdate);
	}, [mediaQuery]);

	return mediaQuery.matches;
}
