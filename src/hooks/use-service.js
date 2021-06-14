import React, { useEffect } from 'react';

import { getService, getAppUser } from '@nti/web-client';
import { Promises } from '@nti/lib-commons';
import { Models } from '@nti/lib-interfaces';

/** @typedef {import('@nti/lib-interfaces/src/stores/Service').default} Service */
/** @typedef {import('@nti/lib-interfaces/src/models/Base').default} Model */
/** @typedef {import('@nti/lib-interfaces/src/models/entities/User').default} User */

const DATA = {
	/** @type {Promises.Reader<Service>} */
	service: null,
	/** @type {Promises.Reader<User>} */
	appUser: null,
	/** @type {Object<string, Promises.Reader<any>>} */
	objects: {},
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

/**
 * A "hook" that returns the app user model. The components that use this
 * must be wrapped in <Suspense fallback={...}>.
 *
 * @returns {User}
 */
export function useAppUser() {
	return useAsyncValue('app-user', getAppUser);
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
 * @template {Model} T
 * @param {string} id - The ntiid, id, or url of the object to fetch.
 * @param {typeof T} Type - The expected Model instance (defaults to "any")
 * @returns {T}
 */
export function useObject(id, Type = Models.Base) {
	const service = useService();
	const key = `${id}-${Type?.MimeType}`;

	// This factory is re-created every call to this hook, however, the useAsyncValue will
	// ONLY use it the first time (key is undefined, and key will be cleared once unused)
	const factory = () =>
		service.getObject(
			id,
			Type !== Models.Base ? { type: Type.MimeType } : void 0
		);

	return useAsyncValue(key, factory);
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

/**
 * @template {Model} T
 * @param {string} key
 * @param {() => Promise<T>} factory The factory makes the request, and returns the results. Its the factory's responsibility to manage/cancel inflight re-entry.
 * @param {*} reload - if set, will reload once per unique instance (no primitives allowed)
 * @returns {T}
 */
function useAsyncValue(key, factory, reload) {
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

/**
 *
 * @param {Model} object
 * @param {string} rel
 * @param {Record<string,string>} params
 * @returns {Model|Model[]}
 */
export function useLink(object, rel, { reload, ...params } = {}) {
	const key = object?.getLink(rel, params);
	if (!key) {
		throw new Error('No Link ' + rel);
	}

	return useAsyncValue(
		key,
		async () => object.fetchLinkParsed(rel, params),
		reload
	);
}

/**
 * Provides the object with id to child as prop named.
 * Primarily intended for storybook.
 *
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.prop
 * @param {JSX.Element} props.children
 * @returns {JSX.Element}
 */
export function NTObject({ id, prop, children }) {
	const child = React.Children.only(children);
	const item = useObject(id);

	return React.cloneElement(child, { [prop]: item });
}
