import { useEffect, useRef } from 'react';

import { matches } from '@nti/lib-dom';

function ignoreResize(target) {
	return matches(target, '[aria-hidden=true], [aria-hidden=true] *');
}

export function useResizeObserver(onChange) {
	const changeRef = useRef(null);
	const observerRef = useRef(null);

	useEffect(
		() =>
			// cleanup
			() => {
				observerRef.current?.disconnect();
				observerRef.current = null;
				changeRef.current = null;
			},
		// hook only runs on mount, and only cleans up on unmount.
		[]
	);

	if (changeRef.current === onChange) {
		return observerRef.current;
	}

	observerRef.current?.disconnect();

	changeRef.current = onChange;

	if (typeof ResizeObserver === 'undefined') {
		return (observerRef.current = {
			disconnect() {},
			observe() {},
			unobserve() {},
		});
	}

	observerRef.current = new ResizeObserver(entries => {
		for (let entry of entries) {
			if (!ignoreResize(entry.target)) {
				onChange(entry.target.getBoundingClientRect());
			}
		}
	});

	return observerRef.current;
}
