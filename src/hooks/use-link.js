import { useAsyncValue } from './use-async-value';

/** @typedef {import('@nti/lib-interfaces/src/models/Base').default} Model */

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
