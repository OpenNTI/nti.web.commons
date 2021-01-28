import React from 'react';
import PropTypes from 'prop-types';

import {Variant} from '../HighOrderComponents';

import FontIcon from './Font-Icon';

const Down = 'down';
const Left = 'left';
const Right = 'right';
const Up = 'up';

const classes = {
	large: {
		[Down]: 'icon-chevron-down',
		[Left]: 'icon-chevron-left',
		[Right]: 'icon-chevron-right',
		[Up]: 'icon-chevron-up'
	},
	default: {
		[Down]: 'icon-chevron-down-10',
		[Left]: 'icon-chevron-left-10',
		[Right]: 'icon-chevron-right-10',
		[Up]: 'icon-chevron-up-10'
	}
};

Chevron.Down = Variant(Chevron, {direction: Down});
Chevron.Left = Variant(Chevron, {direction: Left});
Chevron.Right = Variant(Chevron, {direction: Right});
Chevron.Up = Variant(Chevron, {direction: Up});
Chevron.propTypes = {
	direction: PropTypes.string,
	large: PropTypes.bool
};
export function Chevron ({direction = Down, large, ...props}) {
	const icon = classes[large ? 'large' : 'default'][direction];

	return (
		<FontIcon icon={icon} {...props} />
	);
}
