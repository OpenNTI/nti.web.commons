import React from 'react';
import PropTypes from 'prop-types';

import {ForwardRef} from '../../decorators';

import Base from './Base';
import Registry from './Registry';

function isPlainText ({text, hasMarkup, hasComponents}) {
	return typeof text === 'string' && !hasMarkup && !hasComponents;
}

export default
@Registry.register(isPlainText)
@ForwardRef('textRef')
class NTIPlainText extends React.Component {
	static propTypes = {
		text: PropTypes.string,
		textRef: PropTypes.func
	}


	render () {
		const {text, textRef, ...otherProps} = this.props;

		return (
			<Base {...otherProps} ref={textRef}>{text}</Base>
		);
	}
}