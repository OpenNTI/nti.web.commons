import React from 'react';
import PropTypes from 'prop-types';

import {Variant} from '../HighOrderComponents';
import {ForwardRef} from '../decorators';

import variants from './variants';
import {Overflow} from './Constants';
import {getTextPropsFromChildren} from './utils';
import {getTransforms} from './transforms';
import Renderer from './Renderer';

export default
@ForwardRef('textRef')
class NTIText extends React.Component {
	static Overflow = Overflow

	static Base = Variant(this, variants.Base, 'Base')

	static propTypes = {
		children: PropTypes.any,
		textRef: PropTypes.func,
		className: PropTypes.string
	}

	render () {
		const {children, textRef, className, ...props} = this.props;

		const textProps = getTextPropsFromChildren(children);
		const combinedProps = {...props, ...textProps};

		const transforms = getTransforms(combinedProps).reverse();

		let cmp = (<Renderer className={className} {...textProps} ref={textRef} />);

		for (let Transform of transforms) {
			cmp = (
				<Transform {...combinedProps} className={className}>
					{cmp}
				</Transform>
			);
		}

		return cmp;
	}
}