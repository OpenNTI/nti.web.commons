import React from 'react';
import cx from 'classnames';

import Notice from './Notice';

import {scoped} from 'nti-lib-locale';

const DEFAULT_TEXT = {
	emptyList: 'This list is empty.',
	'emptyList:discussions': 'No discussions.',
	'emptyList:lesson-overview': 'Empty Overview :(\nThis lesson is missing content.',
	'emptyList:library-admin': 'No Administered Courses.',
	'emptyList:library-books': 'You don\'t have any books.',
	'emptyList:library-courses': 'You don\'t have any courses yet.',
	'emptyList:library-communities': 'You aren\'t in any communities yet.',
	'emptyList:videos': 'No videos.',
	'emptyList:activity': 'No Activity.',
	'emptyList:user-details': 'Empty Profile :(\nNo additional profile information available.',
	'emptyList:memberships': 'No memberships',
	'emptyList:communities': 'No communities',
	'emptyList:groups': 'No groups',
	'emptyList:friendslists': 'No Lists.',
	'emptyList:dynamicfriendslists': 'No Groups.',
	'emptyList:contacts': 'No contacts.',
	'emptyList:contactssearch': 'No contacts found.',
	'emptyList:entity-search': 'No one found',
	'emptyList:assignments': 'No assignments currently available.',
	'emptyList:search': 'No Results Found.\nTry a different search.',
	'emptyList:content-resources': 'Empty Folder.'
};

const t = scoped('LISTS', DEFAULT_TEXT);

export default function EmptyList ({type}) {
	let heading;
	let message = t('emptyList');
	if (type) {
		message = t('emptyList:' + type);
	}

	message = message.split('\n');
	if (message.length === 1) {
		[message] = message;
	}
	else {
		[heading, message] = message;
	}

	return (
		<Notice className={cx('empty-list', type)}>
			{heading && ( <h1>{heading}</h1> )}
			{message}
		</Notice>
	);
}


EmptyList.propTypes = {
	type: React.PropTypes.string
};
