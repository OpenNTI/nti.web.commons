import {User, getAppUsername} from '@nti/web-client';
import {scoped} from '@nti/lib-locale';

import {useResolver} from '../hooks';

const {isResolved} = useResolver;
const t = scoped('web-commons.user.Hooks', {
	anonymous: 'Anonymous User'
});

const getId = x => x?.getID?.() ?? x;
const getUnresolved = () => t('anonymous'); // do we need to show identifying number

useUser.getAnonymous = (id) => {
	const unresolved = getUnresolved(id);

	return {
		displayName: unresolved,
		username: unresolved,
		getID: () => id || '__unresolvedUser__',
		anonymous: true
	};
};
export function useUser (user) {
	const resolver = useResolver(async () => {
		try {
			const id = !user || user === 'me' ? getAppUsername() : getId(user);
			const entity = await User.resolve({entity: id});

			return entity;
		} catch (e) {
			const unresolved = getUnresolved();

			return {
				displayName: unresolved,
				username: unresolved,
				getID: () => '__unresolvedUser__',
				anonymous: true
			};
		}
	}, [user]);

	return isResolved(resolver) ? resolver : null; 
}