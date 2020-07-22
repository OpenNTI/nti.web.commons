import React from 'react';
import PropTypes from 'prop-types';

import {Variant} from '../HighOrderComponents';

import FontIcon from './Font-Icon';

// const Up = 'up';
const UpRight = 'up-right';
// const Right = 'right';
// const DownRight = 'down-right';
// const Down = 'down';
// const DownLeft= 'down-left';
// const Left = 'left';
// const UpLeft = 'up-left';

const classes = {
	[UpRight]: 'icon-launch'
};

ArrowIcon.UpRight = Variant(ArrowIcon, {direction: UpRight});
ArrowIcon.propTypes = {
	direction: PropTypes.string
};
export default function ArrowIcon ({direction = UpRight, ...otherProps}) {
	const icon = classes[direction];

	if (!icon) { throw new Error('Arrow Icon Direction not implemented'); }

	return (
		<FontIcon icon={icon} {...otherProps} />
	);
}