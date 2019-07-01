import React from 'react';
import PropTypes from 'prop-types';

import {ForwardRef} from '../decorators';

import {Ellipsis} from './Constants';
import {getTextPropsFromChildren} from './utils';
import {getTransforms} from './transforms';
import Renderer from './Renderer';

export default
@ForwardRef('textRef')
class NTIText extends React.Component {
	static Ellipsis = Ellipsis

	static propTypes = {
		children: PropTypes.any,
		textRef: PropTypes.func
	}

	render () {
		const {children, textRef, ...props} = this.props;

		const textProps = getTextPropsFromChildren(children);
		const combinedProps = {...props, ...textProps};

		const transforms = getTransforms(combinedProps);

		let cmp = (<Renderer {...textProps} ref={textRef} />);

		for (let Transform of transforms) {
			cmp = (
				<Transform {...combinedProps}>
					{cmp}
				</Transform>
			);
		}

		return cmp;
	}
}