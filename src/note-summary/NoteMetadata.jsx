import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import {scoped} from '@nti/lib-locale';

import {DateTime} from '../components';

import styles from './NoteMetadata.css';

const t = scoped('web-video.note-summary.metadata', {
	commentCount: {
		one: '%(count)s Comment',
		other: '%(count)s Comments'
	}
});

const cx = classnames.bind(styles);

export default function NoteMetadata ({note}, ...props) {
	return (
		<div className={cx('note-metadata')}>
			<span className={cx('comment-count')}>{t('commentCount', {count: note.replyCount})}</span>
			<span className={cx('last-modified')}><DateTime date={note.getLastModified()} relative /></span>
		</div>
	);
}

NoteMetadata.propTypes = {
	note: PropTypes.shape({
		replyCount: PropTypes.number.isRequired,
		getLastModified: PropTypes.func.isRequired
	}).isRequired
};
