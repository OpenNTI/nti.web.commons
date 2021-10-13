import { useEffect } from 'react';

import { addClass, removeClass } from '@nti/lib-dom';

const NODES = new WeakMap();

const getBin = k => NODES.get(k) || {};
const setCount = (k, n, c) => (NODES.set(k, { ...getBin(k), [n]: c }), c);
const getCount = (k, n) => getBin(k)[n] ?? setCount(k, n, 0);

const increment = (k, n) => setCount(k, n, getCount(k, n) + 1);
const decrement = (k, n) => setCount(k, n, Math.max(0, getCount(k, n) - 1));

function add(node, className) {
	increment(node, className);
	addClass(node, className);
	return () => {
		if (decrement(node, className) <= 0) {
			removeClass(node, className);
		}
	};
}

export default function AddClass({ node = document.body, className }) {
	useEffect(() => add(node, className), [node, className]);
	return null;
}
