import React from 'react';
import PropTypes from 'prop-types';

import {getRenderer} from './renderers';

const NTITextRenderer = React.forwardRef((props, ref) => {
	const Renderer = getRenderer(props);

	if (!Renderer) { throw new Error('Unable to render text: ', props.text); }

	return (<Renderer {...props} ref={ref} />);
});

NTITextRenderer.displayName = 'NTITextRenderer';
NTITextRenderer.propTypes = {
	text: PropTypes.node
};

export default NTITextRenderer;
