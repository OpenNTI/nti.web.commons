import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import Text from '../text';

import AvatarBase from './Avatar';

const t = scoped('web-commons.user.AvatarGrid', {
	remaining: '+%(remaining)s',
});

//#region styles
const Avatar = styled(AvatarBase)`
	width: 100%;
`;

const Grid = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0 -2px;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
`;

const Item = styled.li`
	display: inline-block;
	padding: 0;
	width: 42px;
	height: 42px;
	border-radius: 42px;
	overflow: hidden;
	border: 2px solid white;
	margin-right: -10px;
`;

const Remaining = styled.li`
	background: var(--border-grey-light);
	font-size: 0.625rem;
	font-weight: 600;
	color: var(--secondary-grey);
	display: inline-flex;
	align-items: center;
	justify-content: center;
`;
//#endregion

AvatarGrid.propTypes = {
	className: PropTypes.string,
	users: PropTypes.array,
	max: PropTypes.number,
};
export default function AvatarGrid({ className, users, max }) {
	const toShow = max == null ? users : users.slice(0, max);
	const remaining = users.length - toShow.length;

	return (
		<Grid className={className}>
			{toShow.map(user => (
				<Item key={user.getID()}>
					<Avatar user={user} />
				</Item>
			))}
			{!remaining ? null : (
				<Remaining>
					<Text.Base>{t('remaining', { remaining })}</Text.Base>
				</Remaining>
			)}
		</Grid>
	);
}
