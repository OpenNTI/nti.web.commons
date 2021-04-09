import { useEffect } from 'react';

import { createDOM } from '@nti/lib-dom';

const CACHE = new Map();
const getKey = spec =>
	spec instanceof Object
		? spec
		: (getKey.keys = getKey.keys || {})[spec] ||
		  (getKey.keys[spec] = { spec });
const getDOM = spec =>
	CACHE.get(getKey(spec)) ||
	CACHE.set(getKey(spec), { refs: 0, dom: createDOM(spec) }).get(
		getKey(spec)
	);

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
