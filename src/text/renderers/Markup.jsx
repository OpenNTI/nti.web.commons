import React from 'react';
import PropTypes from 'prop-types';
import {rawContent} from '@nti/lib-commons';

import {ForwardRef} from '../../decorators';

import Base from './Base';
import Registry from './Registry';

function isMarkup ({text, hasMarkup, hasComponents}) {
	return typeof text === 'string' && hasMarkup && !hasComponents;
}

export default
@Registry.register(isMarkup)
@ForwardRef('textRef')
class NTIMarkupText extends React.Component {
	static propTypes = {
		text: PropTypes.string,
		textRef: PropTypes.func
	}


	render () {
		const {text, textRef, ...otherProps} = this.props;

		return (
			<Base {...otherProps} ref={textRef} {...rawContent(text)} />
		);
	}
}