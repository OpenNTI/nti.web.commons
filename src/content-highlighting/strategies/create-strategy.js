import React from 'react';


export default function createStrategy (findRanges) {
	const strategy = (...args) => ((container) => findRanges(container, ...args));

	strategy.useStrategy = (...args) => (
		React.useCallback(
			() => strategy(...args),
			args
		);
	);

	return strategy;
}
