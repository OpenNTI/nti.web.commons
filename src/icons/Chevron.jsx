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
		[Down]: 'icon-chevrondown-10',
		[Left]: 'icon-chevronleft-10',
		[Right]: 'icon-chevronright-10',
		[Up]: 'icon-chevronup-10'
	}
};

ChevronIcon.Down = Variant(ChevronIcon, {direction: Down});
ChevronIcon.Left = Variant(ChevronIcon, {direction: Left});
ChevronIcon.Right = Variant(ChevronIcon, {direction: Right});
ChevronIcon.Up = Variant(ChevronIcon, {direction: Up});
ChevronIcon.propTypes = {
	direction: PropTypes.string,
	large: PropTypes.bool
};
export default function ChevronIcon ({direction = Down, large, ...props}) {
	const icon = classes[large ? 'large' : 'default'][direction];

	return (
		<FontIcon icon={icon} {...props} />
	);
}