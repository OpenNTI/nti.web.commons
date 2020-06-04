import React from 'react';
import PropTypes from 'prop-types';
import filesize from 'filesize';

import Text from '../text';

//http://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function getSize (file, size, decimals) {
	const bytes = size ?? file.size ?? 0;

	return filesize(bytes, {round: decimals});
}

FileSize.propTypes = {
	file: PropTypes.shape({
		size: PropTypes.number	
	}),
	size: PropTypes.number,
	decimals: PropTypes.number
};
export default function FileSize ({file, size, decimals = 2, ...otherProps}) {
	return (
		<Text.Base {...otherProps}>
			{getSize(file, size, decimals)}
		</Text.Base>
	);
}