import { useEffect } from 'react';

import { addClass as add, removeClass as remove } from '@nti/lib-dom';

const Refs = new Map();

export const useExternClassName = (className, node = global.document?.body) => {
	useEffect(() => {
		if (!node) return;

		const counts = Refs.get(node) || Refs.set(node, {}).get(node);

		add(node, className);

		counts[className] = Math.max((counts[className] || 0) + 1, 1);

		return () => {
			if (--counts[className] <= 0) {
				remove(node, className);
			}
		};
	}, [node, className]);
};
