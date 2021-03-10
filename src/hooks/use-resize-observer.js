import { useRef } from 'react';

import { matches } from '@nti/lib-dom';

function ignoreResize(target) {
	return matches(target, '[aria-hidden=true], [aria-hidden=true] *');
}

export function useResizeObserver(onChange) {
	const changeRef = useRef(null);
	const observerRef = useRef(null);

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
