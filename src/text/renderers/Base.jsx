import React from 'react';
import PropTypes from 'prop-types';

import {ForwardRef} from '../../decorators';

export default
@ForwardRef('textRef')
class NTIBaseText extends React.Component {
	static propTypes = {
		as: PropTypes.any,
		children: PropTypes.any,
		textRef: PropTypes.func
	}

	render () {
		const {as: Tag, textRef, children, ...otherProps} = this.props;
		const Cmp = Tag || 'span';

		//TODO: is there a better way?
		delete otherProps.hasComponents;
		delete otherProps.hasMarkup;
		delete otherProps.linkify;
		delete otherProps.overflow;

		return (
			<Cmp {...otherProps} ref={textRef}>
				{children}
			</Cmp>
		);
	}
}
