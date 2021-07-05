import { getService } from '@nti/web-client';
import { Promises } from '@nti/lib-commons';

/** @typedef {import('@nti/lib-interfaces/src/stores/Service').default} Service */

const DATA = {
	/** @type {Promises.Reader<Service>} */
	service: null,
};

/**
 * A "hook" that returns the service document. The components that use this
 * must be wrapped in <Suspense fallback={...}>.
 *
 * @returns {Service}
 */
export function useService() {
	// This doesn't use the async value hook because we do not want the
	// service document flushing until we explicitly direct it to.
	if (!DATA.service) {
		DATA.service = Promises.toReader(getService());
	}

	return DATA.service.read();
}
// Storybook, tests, and logouts
useService.flush = () => (DATA.service = null);
global.addEventListener?.('flush-service-document', useService.flush);
