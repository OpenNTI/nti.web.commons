import './TypeAndSize.scss';
import { extname } from 'path';

import PropTypes from 'prop-types';
import mime from 'mime-types';

import { scoped } from '@nti/lib-locale';

import { filesize } from '../../../utils';
import LabeledValue from '../../LabeledValue';

const DEFAULT_TEXT = {
	FileSize: 'File Size',
	FileType: 'File Type',
};

const t = scoped('common.components.content-resources.inspector', DEFAULT_TEXT);

function getType(item) {
	const ext = mime.extension(item.getFileMimeType());
	return (
		(ext !== 'bin' && ext
			? ext
			: extname(item.getFileName()).replace(/^\./, '')
		).toUpperCase() || 'Unknown'
	);
}

TypeAndSize.propTypes = {
	item: PropTypes.object.isRequired,
};

export default function TypeAndSize(props) {
	const { item } = props;
	if (!item) {
		return null;
	}

	const size = filesize(item.getFileSize() || 0);
	const type = getType(item);

	return (
		<div className="resource-viewer-inspector-file-type-and-size">
			<LabeledValue label={t('FileType')}>{type}</LabeledValue>
			<LabeledValue label={t('FileSize')}>{size}</LabeledValue>
		</div>
	);
}
