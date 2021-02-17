import React from 'react';
import PropTypes from 'prop-types';

import ImageContainer from '../image/Container';

import Base from './Base';
import generator from './generator';

ImagePlaceholder.propTypes = {
	aspectRatio: PropTypes.number,
};
function ImagePlaceholder ({aspectRatio, ...otherProps}) {
	return (
		<ImageContainer
			{...otherProps}
			as={Base}
			aspectRatio={aspectRatio}
		/>
	);
}

export default generator(ImagePlaceholder);
