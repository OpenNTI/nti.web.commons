import { useEffect } from 'react';

import { getService, getAppUser } from '@nti/web-client';
import { Promises } from '@nti/lib-commons';
import { Models } from '@nti/lib-interfaces';

/** @typedef {import('@nti/lib-interfaces/src/stores/Service').default} Service */
/** @typedef {import('@nti/lib-interfaces/src/models/entities/User').default} User */

const DATA = {
	/** @type {Promises.Reader<Service>} */
	service: null,
	/** @type {Promises.Reader<User>} */
	appUser: null,
	/** @type {Object<string, Promises.Reader<Models.Base>>} */
	objects: {},
};

/**
 * A "hook" that returns the service document. The components that use this
 * must be wrapped in <Suspense fallback={...}>.
 *
 * @returns {Service}
 */
export function useService() {
	if (!DATA.service) {
		DATA.service = Promises.toReader(getService());
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
		DATA.appUser = Promises.toReader(getAppUser());
	}
	return DATA.appUser.read();
}

/**
 * Basic example to fetch an object with suspense & hooks.
 * The typing is not perfect, ideally it would show the return type
 * being an instance of Type, but in the interest of time, I left
 * it showing the base model as the type. The composing hook can have
 * an explicit return type of the model it represents.
 *
 * A composing hook can use this as its primary implementation, and
 * just pass in the type and type the return. For example:
 * ```js
 * /**
 *  \* \@returns {CatalogEntry}
 *  \*\/
 * function useCatalogEntry (id) {
 * 	/** \@type {CatalogEntry} *\/
 * 	return useObject(id, CatalogEntry);
 * }
 * ```
 *
 *
 * @protected
 * @template {Models.Base} T
 * @param {string} id - The ntiid, id, or url of the object to fetch.
 * @param {typeof T} Type - The expected Model instance (defaults to "any")
 * @returns {T}
 */
export function useObject(id, Type = Models.Base) {
	const service = useService();
	const key = `${id}-${Type?.MimeType}`;

	/** @type {Promises.Reader<Type>} (reader) */
	let reader = DATA.objects[key];

	if (!reader) {
		/** @type {Promises.Reader<Type>} */
		reader = DATA.objects[key] = Promises.toReader(
			service.getObject(
				id,
				Type !== Models.Base ? { type: Type.MimeType } : void 0
			)
		);
		reader.Type = Type;
		reader.used = 1;
	} else {
		reader.used++;
	}

	useEffect(
		// This effect just returns a cleanup call.
		() =>
			// The cleanup will decrement the used count and if zero,
			// remove it so we get a fresh object next time.
			() => {
				if (--reader.used <= 0) {
					delete DATA.objects[key];
				}
			},
		// effect only runs on mount/unmount with an empty dep list.
		[]
	);

	return reader.read();
}
