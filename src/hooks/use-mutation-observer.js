import React from 'react';

const DefaultOptions = {
	attributes: true,
	characterData: true,
	childList: true,
	subtree: true
};

export default function useMutationObserver (ref, callback, options = DefaultOptions) {
	React.useEffect(() => {
		if (!ref?.current) { return; }

		let task = null;

		//Use an animation frame to prevent tight loops from a mutation triggering a state
		//update triggering a mutation etc.
		const observer = new MutationObserver((entries, obs) => {
			cancelAnimationFrame(task);
			task = requestAnimationFrame(() => {
				callback(entries, obs);
			});
		});

		observer.observe(ref.current, options);

		return () => observer.disconnect();
	}, [ref, callback]);
}