import { useCallback, useEffect, useState } from 'react';

import { useResizeObserver } from './use-resize-observer';

export function useContainerWidth(ref) {
	const { current: el } = ref;
	const [currentWidth, trackWidth] = useState(0);

	const handleResize = useCallback(() => {
		const x = el?.offsetWidth;
		if (el && x !== currentWidth) {
			trackWidth(x);
		}
	}, [el, trackWidth, currentWidth]);

	const observer = useResizeObserver(handleResize);

	useEffect(() => {
		trackWidth(el?.offsetWidth);
		if (el) {
			observer.observe(el);
			return () => observer.unobserve(el);
		}
	}, [observer, el]);

	return currentWidth ?? el?.offsetWidth;
}
