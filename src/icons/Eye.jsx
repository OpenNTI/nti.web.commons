import React from 'react';
import PropTypes from 'prop-types';

import {Variant} from '../HighOrderComponents';

import FontIcon from './Font-Icon';

const Slash = 'slash';
const NoSlash = 'no-slash';

const classes = {
	[Slash]: 'icon-hide',
	[NoSlash]: 'icon-view'
};


Eye.Slash = Variant(Eye, {variant: Slash});
Eye.propTypes = {
	variant: PropTypes.string
};
export function Eye ({variant = NoSlash, ...props}) {
	const icon = classes[variant];

	return (
		<FontIcon icon={icon} {...props} />
	);
}
