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


EyeIcon.Slash = Variant(EyeIcon, {variant: Slash});
EyeIcon.propTypes = {
	variant: PropTypes.string
};
export default function EyeIcon ({variant = NoSlash, ...props}) {
	const icon = classes[variant];

	return (
		<FontIcon icon={icon} {...props} />
	);
}