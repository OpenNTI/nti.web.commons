import React from 'react';
import PropTypes from 'prop-types';
import generator from './generator';

ContainerPlaceholder.propTypes = {
	as: PropTypes.any
};
function ContainerPlaceholder ({as:tag, ...otherProps}) {
	const Cmp = tag || 'div';

	return (<Cmp {...otherProps} />);
}

export default generator(ContainerPlaceholder);
