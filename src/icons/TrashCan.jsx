import React from 'react';
import PropTypes from 'prop-types';

import FontIcon from './types/Font-Icon';

TrashCan.propTypes = {
	fill: PropTypes.bool,
};
export function TrashCan({ fill, ...props }) {
	const icon = fill ? 'icon-delete' : 'icon-trash';

	return <FontIcon icon={icon} {...props} />;
}
