import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { User } from '@nti/web-client';
import { useChanges, useReducerState } from '@nti/web-core';

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
	const userId = me ? null : getID(entity);
	const [state, setState] = useReducerState({
		entity: null,
		error: null,
		generation: 0,
	});

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
