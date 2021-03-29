import React from 'react';
import PropTypes from 'prop-types';

import { filterProps } from '../../utils';

const NTIBaseText = React.forwardRef(
	({ as: Tag = 'span', ...otherProps }, ref) => (
		<Tag {...filterProps(otherProps, Tag)} ref={ref} />
	)
);

NTIBaseText.displayName = 'NTIBaseText';
NTIBaseText.propTypes = {
	as: PropTypes.any,
	children: PropTypes.any,
	textRef: PropTypes.func,
};

export default NTIBaseText;
