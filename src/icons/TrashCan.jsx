import React from 'react';
import PropTypes from 'prop-types';

import FontIcon from './Font-Icon';

TrashIcon.propTypes = {
	fill: PropTypes.bool
};
export default function TrashIcon ({fill, ...props}) {
	const icon = fill ? 'icon-delete' : 'icon-trash';

	return (
		<FontIcon icon={icon} {...props} />
	);
}
