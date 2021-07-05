import React from 'react';

import { Models } from '@nti/lib-interfaces';

import { useAsyncValue } from './use-async-value';
import { useService } from './use-service';

/** @typedef {import('@nti/lib-interfaces/src/models/Base').default} Model */

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
