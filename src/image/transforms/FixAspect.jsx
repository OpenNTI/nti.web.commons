import React from 'react';
import PropTypes from 'prop-types';

import {getFixedImageSrc} from '../utils';

export default class FixAspect extends React.Component {
	static shouldApply ({aspectRatio}) { return aspectRatio != null; }

	static propTypes = {
		children: PropTypes.any,

		aspectRatio: PropTypes.number,
		letterbox: PropTypes.string,

		src: PropTypes.string,
		_loader: PropTypes.object
	}

	state = {}

	componentDidMount () {
		this.setup();
	}

	componentDidUpdate (prevProps) {
		const {src} = this.props;
		const {src: prevSrc} = prevProps;

		if (src !== prevSrc) {
			this.setup();
		}
	}

	setup () {
		const {_loader, aspectRatio, letterbox} = this.props;

		this.setState({
			src: getFixedImageSrc(_loader, aspectRatio, letterbox)
		});
	}

	render () {
		const {src: propSrc, children} = this.props;
		const {src: fixedSrc} = this.state;

		const child = React.Children.only(children);

		return React.cloneElement(child, {src: fixedSrc || propSrc});
	}
}