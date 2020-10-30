import React from 'react';
import PropTypes from 'prop-types';

import {ForwardRef} from '../../decorators';
import {filterProps} from '../../utils';

class NTIBaseText extends React.Component {
	static propTypes = {
		as: PropTypes.any,
		children: PropTypes.any,
		textRef: PropTypes.func
	}

	render () {
		const {as: Tag, textRef, children, ...otherProps} = this.props;
		const Cmp = Tag || 'span';

		return (
			<Cmp {...filterProps(otherProps, Cmp)} ref={textRef}>
				{children}
			</Cmp>
		);
	}
}

export default ForwardRef('textRef')(NTIBaseText);
