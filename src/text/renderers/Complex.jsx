import React from 'react';
import PropTypes from 'prop-types';

import {ForwardRef} from '../../decorators';

import Base from './Base';
import Registry from './Registry';

function isComplexText ({hasComponents}) {
	return hasComponents;
}

export default
@Registry.register(isComplexText)
@ForwardRef('textRef')
class NTIComplexText extends React.Component {
	static propTypes = {
		text: PropTypes.any,
		textRef: PropTypes.func
	}

	render () {
		const {text, textRef, ...otherProps} = this.props;

		return (
			<Base {...otherProps} ref={textRef} >{text}</Base>
		);
	}
}
