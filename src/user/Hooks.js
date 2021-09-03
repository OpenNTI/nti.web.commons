import { useEffect, useCallback } from 'react';

import { User, getAppUsername, getUserPreferences } from '@nti/web-client';
import { useAsyncValue } from '@nti/web-core';
import { scoped } from '@nti/lib-locale';

import { useResolver, useForceUpdate } from '../hooks';

/** @typedef {import('@nti/lib-interfaces').Models.preferences.Preference} Preference */
/** @typedef {(value: any) => void} PreferenceValueSetter */

const { isResolved } = useResolver;
const t = scoped('web-commons.user.Hooks', {
	anonymous: 'Anonymous User',
});

const getId = x => x?.getID?.() ?? x;
const getUnresolved = () => t('anonymous'); // do we need to show identifying number

useUser.getAnonymous = id => {
	const unresolved = getUnresolved(id);

	return {
		isUser: true,
		displayName: unresolved,
		username: unresolved,
		getID: () => id || '__unresolvedUser__',
		anonymous: true,
	};
};
export function useUser(user) {
	const resolver = useResolver(async () => {
		try {
			const id = user && (user === 'me' ? getAppUsername() : getId(user));
			const entity = id && (await User.resolve({ entity: id }));

			return entity;
		} catch (e) {
			const unresolved = getUnresolved();

			return {
				displayName: unresolved,
				username: unresolved,
				getID: () => '__unresolvedUser__',
				anonymous: true,
			};
		}
	}, [user]);

	return isResolved(resolver) ? resolver : null;
}

/**
 * Provides convenient access to UserPreferences and listens for user preference changes.
 * Use this for raw access to the entire preference tree. There is another hook that
 * refines your access to a singular branch. Prefer that one unless you really need the
 * entire preference store
 *
 * @param {[string]} keys - Optional - If provided, change events will only fire for the given preference keys
 * @returns {Object} - a UserPreferences object
 */
export const usePreferences = keys => {
	const preferences = useAsyncValue('getUserPreferences', getUserPreferences);
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		const onChange = changes => {
			if (
				keys == null ||
				changes == null ||
				Object.keys(changes).some(k => keys.find(x => k.startsWith(x)))
			) {
				forceUpdate();
			}
		};

		preferences?.addListener('change', onChange);
		return () => preferences?.removeListener('change', onChange);
	}, [preferences, keys, forceUpdate]);
	return preferences;
};

/**
 * Get a specific preference value.
 *
 * @param {string} key
 * @returns {[Preference, PreferenceValueSetter]}
 */
export const usePreference = key => {
	const preferences = usePreferences([key]);
	const value = preferences?.get(key);
	const setValue = useCallback(
		v => preferences?.set(key, v),
		[key, preferences]
	);
	return [value, setValue];
};
