import React from 'react';
import PropTypes from 'prop-types';
import mime from 'mime-types';

import Text from '../text';

import Name from './Name';

function getExtension (file, mimeType) {
	const type = mimeType ?? file?.contentType;
	const extForType = type && mime.extension(type);

	return extForType ?? Name.getParts(file)?.ext ?? 'File';
}

FileExtension.propTypes = {
	file: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.shape({
			contentType: PropTypes.string,
			filename: PropTypes.string
		})
	]),
	mimeType: PropTypes.string
};
export default function FileExtension ({file, mimeType, ...otherProps}) {
	return (
		<Text.Base {...otherProps}>
			{getExtension(file, mimeType)}
		</Text.Base>
	);
}
