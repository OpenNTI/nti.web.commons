import { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

import { User, getAppUsername } from '@nti/web-client';

import { useChanges } from '../hooks/use-changes';

const CLASSIC_STATE = (s, action) => ({ ...s, ...action });

/**
 * This component can use the full Entity instance if you have it.
 * Otherwise, it will take a username string for the entity prop.
 */

BaseEntity.propTypes = {
	entity: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	me: PropTypes.bool,
	children: PropTypes.func,
};

export default function BaseEntity({ entity, me, children, ...props }) {
	const getID = x => x?.getID?.() || x;
	const userId = me ? getAppUsername() : getID(entity);
	const [state, setState] = useReducer(CLASSIC_STATE, {});

	useEffect(() => {
		let late = false;
		(async () => {
			const newState = {};
			try {
				newState.entity = await User.resolve({ entity, me });
			} catch (e) {
				const unresolvedName = getUsername(userId);
				Object.assign(newState, {
					error: e,
					entity: {
						displayName: unresolvedName,
						username: unresolvedName,
						getID: () => {
							'__unresolvedUser__';
						},
					},
				});
			} finally {
				if (!late) setState(newState);
			}
		})();
		//
		return () => {
			late = true;
		};
	}, [userId, state.generation]);

	useChanges(state.entity, () => {
		setState({ entity: null, generation: Date.now() });
	});

	return children?.({ ...props, ...state });
}

function getUsername(usernameSeed) {
	// do we need to show identifying numbers after Anonymous User?
	return 'Anonymous User';
}
