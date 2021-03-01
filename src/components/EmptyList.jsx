import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { scoped } from '@nti/lib-locale';

import Notice from './Notice';

const Box = styled(Notice)`
	text-align: center;
	color: var(--tertiary-grey);
	font-size: 0.875rem;

	h1 {
		font-size: 1.75rem;
		font-weight: 300;
	}
`;

const DEFAULT_TEXT = {
	default: 'This list is empty.',
	discussions: 'No discussions.',
	'lesson-overview': 'Empty Overview :(\nThis lesson is missing content.',
	'library-admin': 'No Administered Courses.',
	'library-books': "You don't have any books.",
	'library-courses': "You don't have any courses yet.",
	'library-communities': "You aren't in any communities yet.",
	videos: 'No videos.',
	activity: 'No Activity.',
	'user-details':
		'Empty Profile :(\nNo additional profile information available.',
	memberships: 'No memberships',
	communities: 'No communities',
	groups: 'No groups',
	friendslists: 'No Lists.',
	dynamicfriendslists: 'No Groups.',
	contacts: 'No contacts.',
	contactssearch: 'No contacts found.',
	'entity-search': 'No one found',
	assignments: 'No assignments currently available.',
	search: 'No Results Found.\nTry a different search.',
	'content-resources': 'Empty Folder.',
	'user-generated-data': 'No associated notes.',
};

const t = scoped('common.components.lists.empty', DEFAULT_TEXT);

export default function EmptyList({ type, className }) {
	let heading;
	let message = t(type || 'default');

	message = message.split('\n');
	if (message.length === 1) {
		[message] = message;
	} else {
		[heading, message] = message;
	}

	return (
		<Box className={cx('empty-list', type, className)}>
			{heading && <h1>{heading}</h1>}
			{message}
		</Box>
	);
}

EmptyList.propTypes = {
	className: PropTypes.string,
	type: PropTypes.string,
};
