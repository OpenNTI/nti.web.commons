import React from 'react';
import PropTypes from 'prop-types';

import {ForwardRef, WithVariants} from '../decorators';

import variants from './variants';
import {Overflow} from './Constants';
import {getTextPropsFromChildren} from './utils';
import {getTransforms} from './transforms';
import Renderer from './Renderer';

export default
@WithVariants(variants)
@ForwardRef('textRef')
class NTIText extends React.Component {
	static Overflow = Overflow

	static propTypes = {
		children: PropTypes.any,
		textRef: PropTypes.func
	}

	render () {
		const {children, textRef, ...props} = this.props;

		const textProps = getTextPropsFromChildren(children);
		const combinedProps = {...props, ...textProps};

		const transforms = getTransforms(combinedProps).reverse();

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