import { useEffect, useCallback } from 'react';

import { User, getAppUsername, getUserPreferences } from '@nti/web-client';
import { scoped } from '@nti/lib-locale';

import { useResolver, useForceUpdate } from '../hooks';

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
 * Provides convenient access to UserPreferences and listens for user preference changes
 * @param {[string]} keys - Optional - If provided, change events will only fire for the given preference keys
 * @returns {Object} - a UserPreferences object
 */
export const usePrefs = keys => {
	const r = useResolver(getUserPreferences);
	const prefs = isResolved(r) ? r : null;
	const forceUpdate = useForceUpdate();
	const onChange = useCallback(
		changes => {
			if (
				!keys ||
				Object.keys(changes || {}).some(k => keys.includes(k))
			) {
				forceUpdate();
			}
		},
		[keys]
	);

	useEffect(() => {
		if (prefs) {
			prefs.addListener('change', onChange);
			return () => prefs.removeListener('change', onChange);
		}
	}, [prefs, onChange]);
	return prefs;
};
