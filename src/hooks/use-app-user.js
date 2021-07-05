import { getAppUser } from '@nti/web-client';

import { useAsyncValue } from './use-async-value';

/** @typedef {import('@nti/lib-interfaces/src/models/entities/User').default} User */

/**
 * A "hook" that returns the app user model. The components that use this
 * must be wrapped in <Suspense fallback={...}>.
 *
 * @returns {User}
 */
export function useAppUser() {
	return useAsyncValue('app-user', getAppUser);
}
