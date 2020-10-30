import React from 'react';
import PropTypes from 'prop-types';

import {filterProps} from '../../utils';

const NTIBaseText = React.forwardRef(function NTIBaseText ({as: Tag = 'span', children, ...otherProps}, ref) {

	//TODO: is there a better way?
	delete otherProps.hasComponents;
	delete otherProps.hasMarkup;
	delete otherProps.linkify;
	delete otherProps.overflow;
	delete otherProps.limitLines;

	return (
		<Tag {...filterProps(otherProps, Tag)} ref={ref}>
			{children}
		</Tag>
	);
});

NTIBaseText.propTypes = {
	as: PropTypes.any,
	children: PropTypes.any,
	textRef: PropTypes.func
};

export default NTIBaseText;
