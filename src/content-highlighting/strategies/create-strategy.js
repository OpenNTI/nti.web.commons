import { useCallback } from 'react';

export default function createStrategy(config) {
	const findRanges =
		(...args) =>
		container =>
			config.findRanges(container, ...args);
	const isActive = (...args) =>
		config.isActive ? config.isActive(...args) : true;

	findRanges.isActive = isActive;
	findRanges.useStrategy = (...args) => {
		const callback = useCallback(findRanges(...args), args);

		callback.isActive = () => isActive(...args);

		return callback;
	};

	return findRanges;
}
