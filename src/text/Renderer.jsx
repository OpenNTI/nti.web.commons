import React from 'react';
import PropTypes from 'prop-types';

import {ForwardRef} from '../decorators';

import {getRenderer} from './renderers';

export default
@ForwardRef('textRef')
class NTITextRenderer extends React.Component {
	static propTypes = {
		text: PropTypes.node,
		textRef: PropTypes.func
	}

	render (props) {
		const {textRef, ...otherProps} = this.props;
		const Renderer = getRenderer(otherProps);

		if (!Renderer) { throw new Error('Unable to render text: ', props.text); }

		return (<Renderer {...otherProps} ref={textRef} />);
	}
}