import { getService, getAppUser } from '@nti/web-client';

/** @typedef {import('@nti/lib-interfaces/src/stores/Service').default} Service */
/** @typedef {import('@nti/lib-interfaces/src/models/entities/User').default} User */

const DATA = {};

/**
 * A "hook" that returns the service document. The components that use this
 * must be wrapped in <Suspense fallback={...}>.
 *
 * @returns {Service}
 */
export function useService() {
	if (!DATA.service) {
		DATA.service = wrapPromise(getService());
	}
	return DATA.service.read();
}

/**
 * A "hook" that returns the app user model. The components that use this
 * must be wrapped in <Suspense fallback={...}>.
 *
 * @returns {User}
 */
export function useAppUser() {
	if (!DATA.appUser) {
		DATA.appUser = wrapPromise(getAppUser());
	}
	return DATA.appUser.read();
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
