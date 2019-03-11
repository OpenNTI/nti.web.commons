import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {DisplayName} from '../components';

import NoteMetadata from './NoteMetadata';
import NotePreview from './NotePreview';
import styles from './NoteSummary.css';

const cx = classnames.bind(styles);

export default function NoteSummary ({note, ...props}) {
	return (
		<div className={cx('note-summary')}>
			<DisplayName className={cx('author')} entity={note.creator} />
			<NotePreview note={note} />
			<NoteMetadata note={note} />
		</div>
	);
}

NoteSummary.propTypes = {
	note: PropTypes.object.isRequired
};
