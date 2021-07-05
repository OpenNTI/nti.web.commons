import { useEffect } from 'react';

import { Promises } from '@nti/lib-commons';

const DATA = {
	/** @type {Object<string, Promises.Reader<any>>} */
	objects: {},
};

/** @typedef {import('@nti/lib-interfaces/src/models/Base').default} Model */

/**
 * @template {Model} T
 * @param {string} key
 * @param {() => Promise<T>} factory The factory makes the request, and returns the results. Its the factory's responsibility to manage/cancel inflight re-entry.
 * @param {*} reload - if set, will reload once per unique instance (no primitives allowed)
 * @returns {T}
 */
export function useAsyncValue(key, factory, reload) {
	let reader = DATA.objects[key];

	if (!reader || shouldReload(reload)) {
		reader = DATA.objects[key] = Promises.toReader(factory());
		// we initialize to 0 because we will increment within the effect hook.
		reader.used = reader?.used ?? 0;
	}

	useEffect(
		// This effect just increments the usage count, and returns a cleanup call.
		() => {
			// This will only increment each time this body is called (once per component that is using the
			// key/reader instance) If the key changes, the cleanup will decrement and eventually free/delete
			// the data.
			reader.used++;
			// The cleanup will decrement the used count and if zero,
			// remove it so we get a fresh object next time. (but only
			// if the object matches what we have)
			return () => {
				if (--reader.used <= 0 && reader === DATA.objects[key]) {
					delete DATA.objects[key];
				}
			};
		},
		// effect only runs on mount/unmount with an empty dep list.
		[key, reader]
	);

	return reader.read();
}

function shouldReload(nonce) {
	const self = shouldReload;
	const seen = self.seen || (self.seen = new WeakSet());

	if (/boolean|string|number/.test(typeof nonce)) {
		throw new Error(
			'Reload nonce should be an object with a unique reference (address). Primitive values are non-unique.'
		);
	}

	if (nonce && !seen.has(nonce)) {
		seen.add(nonce);
		return true;
	}

	return false;
}
