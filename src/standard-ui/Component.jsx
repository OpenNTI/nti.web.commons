import React from 'react';
import PropTypes from 'prop-types';

StandardComponent.propTypes = {
	as: PropTypes.any
};
export default function StandardComponent ({as:tag, ...otherProps}) {
	const Cmp = tag || 'div';

	return (
		<Cmp {...otherProps} />
	);
}