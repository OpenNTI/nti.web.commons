import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import Text from '../text';

import Styles from './AvatarGrid.css';
import Avatar from './Avatar';

const t = scoped('web-commons.user.AvatarGrid', {
	remaining: '+%(remaining)s'
});

AvatarGrid.propTypes = {
	className: PropTypes.string,
	users: PropTypes.array,
	max: PropTypes.number
};
export default function AvatarGrid ({className, users, max}) {
	const toShow = max == null ? users : users.slice(0, max);
	const remaining = users.length - toShow.length;

	return (
		<ul className={cx(Styles.avatarGrid, className)}>
			{toShow.map((user) => (
				<li key={user.getID()}>
					<Avatar user={user} />
				</li>
			))}
			{!remaining ?
				null :
				(<li className={Styles.remaining}><Text.Base>{t('remaining', {remaining})}</Text.Base></li>)
			}
		</ul>
	);
}
