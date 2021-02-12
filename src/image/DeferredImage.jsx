import React from 'react';
import PropTypes from 'prop-types';

import { OnScreen } from '../components/monitors';
import { DataURIs } from '../constants';

const { BLANK_IMAGE } = DataURIs;

export default function DeferredImage ({src, className, ...props}) {
	const [source, setSource] = React.useState(BLANK_IMAGE);
	const onChange = React.useCallback((onScreen) => {
		if (onScreen && (src !== source)) {
			setSource(src);
		}
	}, [src]);

	return (
		<OnScreen onChange={onChange} as="img" src={source} {...props} />
	);
}

DeferredImage.propTypes = {
	src: PropTypes.string.isRequired
};
