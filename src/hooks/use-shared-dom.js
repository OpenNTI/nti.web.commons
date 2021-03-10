import { useEffect } from 'react';

import { createDOM } from '@nti/lib-dom';

const CACHE = new Map();
const getDOM = spec =>
	CACHE.get(spec) ||
	CACHE.set(spec, { refs: 0, dom: createDOM(spec) }).get(spec);

export function useSharedDOM(domSpec) {
	useEffect(() => {
		const bin = getDOM(domSpec);
		bin.refs++;

		if (!bin.dom.parent) {
			document.body.appendChild(bin.dom);
		}

		return () => {
			bin.refs--;
			if (bin.refs < 1) {
				bin.dom.remove();
				CACHE.delete(domSpec);
			}
		};
	}, [domSpec]);
}
