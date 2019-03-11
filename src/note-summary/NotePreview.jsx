import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Ellipsed} from '../components';

import styles from './NotePreview.css';

const cx = classnames.bind(styles);

export default function NotePreview ({note, ...props}) {
	return !note ? null : (
		<div className={cx('note-preview')}>
			<Ellipsed measureOverflow="parent">{note.title || (note.body || [])[0]}</Ellipsed>
		</div>
	);
}

NotePreview.propTypes = {
	note: PropTypes.shape({
		title: PropTypes.string,
		body: PropTypes.array
	}).isRequired
};
