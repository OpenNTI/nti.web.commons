import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { getAppUsername } from '@nti/web-client';
import { UserPresence as UserPresenceStore } from '@nti/lib-interfaces';

const Dot = styled.div`
	width: 7px;
	height: 7px;
	border-radius: 7px;
	background: var(--presence-offline);
	&.presence-online,
	&.presence-available {
		background: var(--presence-available);
	}

	&.presence-away {
		background: var(--presence-away);
	}

	&.presence-dnd {
		background: var(--presence-dnd);
	}

	&.border {
		width: 11px;
		height: 11px;
		border: 2px solid white;

		&.dark {
			border-color: #313131;
		}
	}
`;

const UserPresence = props => {
	const {
		children,
		className,
		border,
		dark,
		user,
		me,
		...otherProps
	} = props;

	const current = me ? getAppUsername() : user.getID?.() || user;
	if (typeof current !== 'string') {
		throw new TypeError('Invalid user prop given');
	}

	if (user && me) {
		throw new Error('Specify props.user or props.me, not both.');
	}

	const [presence, setPresence] = useState(
		UserPresenceStore.getPresence(current)
	);
	const state = presence?.getName?.().toLowerCase() || '';

	useEffect(() => {
		setPresence(UserPresenceStore.getPresence(current));

		const onPresenceChanged = (username, newPresence) => {
			if (current === username) {
				setPresence(newPresence);
			}
		};

		UserPresenceStore.addListener('presence-changed', onPresenceChanged);

		return () => {
			UserPresenceStore.removeListener(
				'presence-changed',
				onPresenceChanged
			);
		};
	}, [current]);

	return children ? (
		typeof children === 'function' ? (
			children({ presence })
		) : (
			React.cloneElement(React.Children.only(children), { presence })
		)
	) : (
		<Dot
			border={border}
			dark={dark}
			presence={state}
			className={cx('nti-user-presence-dot', className, state)}
			{...otherProps}
		/>
	);
};

UserPresence.Store = UserPresenceStore;
UserPresence.Dot = Dot;

UserPresence.propTypes = {
	className: PropTypes.string,
	user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
	border: PropTypes.bool,
	dark: PropTypes.bool,
	me: PropTypes.bool,
};

export default UserPresence;
