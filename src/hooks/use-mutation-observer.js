import { useEffect } from 'react';

const DefaultOptions = {
	attributes: true,
	characterData: true,
	childList: true,
	subtree: true,
};

export function useMutationObserver(ref, callback, options = DefaultOptions) {
	useEffect(() => {
		if (!ref?.current) {
			return;
		}

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
