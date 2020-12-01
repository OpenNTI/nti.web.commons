import React from 'react';
import PropTypes from 'prop-types';

import Base from './Base';
import Registry from './Registry';

const isComplexText = ({hasComponents}) => hasComponents;

const NTIComplexText = React.forwardRef(({text, ...otherProps}, ref) => (
	<Base {...otherProps} ref={ref} >{text}</Base>
));

NTIComplexText.displayName = 'NTIComplexText';
NTIComplexText.propTypes = {
	text: PropTypes.any
};

Registry.register(isComplexText)(NTIComplexText);
export default NTIComplexText;
