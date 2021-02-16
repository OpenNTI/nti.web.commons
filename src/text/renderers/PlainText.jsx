import React from 'react';
import PropTypes from 'prop-types';

import Base from './Base';
import Registry from './Registry';

const isPlainText = ({ text, hasMarkup, hasComponents }) =>
	typeof text === 'string' && !hasMarkup && !hasComponents;

const NTIPlainText = React.forwardRef(({ text, ...otherProps }, ref) => (
	<Base {...otherProps} ref={ref}>
		{text}
	</Base>
));

NTIPlainText.displayName = 'NTIPlainText';
NTIPlainText.propTypes = {
	text: PropTypes.string,
};

Registry.register(isPlainText)(NTIPlainText);
export default NTIPlainText;
