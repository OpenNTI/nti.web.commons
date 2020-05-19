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

	static Classes = {
		Base: variants.Base.className,
		Condensed: variants.Condensed.className
	}

	static Base = Variant(this, variants.Base, 'Base')
	static Condensed = Variant(this, variants.Condensed, 'Condensed')

	static propTypes = {
		children: PropTypes.any,
		textRef: PropTypes.func,
		as: PropTypes.string,
		className: PropTypes.string,
		localized: PropTypes.bool
	}

	render () {
		const {children, as: tag, textRef, className, localized, ...props} = this.props;

		const textProps = getTextPropsFromChildren(children, localized);
		const combinedProps = {...props, ...textProps};

		const transforms = getTransforms(combinedProps).reverse();

		let cmp = (<Renderer as={tag} className={className} {...combinedProps} ref={textRef} />);

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