import { getService } from '@nti/web-client';

/** @typedef {import('@nti/lib-interfaces/src/stores/Service').default} Service */

let service;

/**
 * A "hook" that returns the service document. The components that use this
 * must be wrapped in <Suspense fallback={...}>.
 *
 * @returns {Service}
 */
export function useService() {
	if (!service) {
		service = wrapPromise(getService());
	}
	return service.read();
}

// Suspense integration ... should probably be moved somewhere better.
function wrapPromise(promise) {
	let status = 'pending';
	let result;
	const suspender = promise.then(
		r => {
			status = 'success';
			result = r;
		},
		e => {
			status = 'error';
			result = e;
		}
	);
	return {
		read() {
			if (status === 'pending') {
				throw suspender;
			} else if (status === 'error') {
				throw result;
			} else if (status === 'success') {
				return result;
			}
		},
	};
}
