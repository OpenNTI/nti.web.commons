import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Variant } from '../HighOrderComponents';

import FontIcon from './Font-Icon';

const styles = stylesheet`
	.left {
		transform: rotate(270deg);
	}
	.right {
		transform: rotate(270deg);
	}
`;

const Down = 'down';
const Left = 'left';
const Right = 'right';
const Up = 'up';

const classes = {
	skinny: {
		[Down]: 'icon-chevrondown-25',
		[Left]: cx('icon-chevronup-25', styles.left),
		[Right]: cx('icon-chevrondown-25', styles.right),
		[Up]: 'icon-chevronup-25',
	},
	large: {
		[Down]: 'icon-chevron-down',
		[Left]: 'icon-chevron-left',
		[Right]: 'icon-chevron-right',
		[Up]: 'icon-chevron-up',
	},
	default: {
		[Down]: 'icon-chevron-down-10',
		[Left]: 'icon-chevron-left-10',
		[Right]: 'icon-chevron-right-10',
		[Up]: 'icon-chevron-up-10',
	},
};

Chevron.Down = Variant(Chevron, { direction: Down });
Chevron.Left = Variant(Chevron, { direction: Left });
Chevron.Right = Variant(Chevron, { direction: Right });
Chevron.Up = Variant(Chevron, { direction: Up });
Chevron.propTypes = {
	direction: PropTypes.string,
	large: PropTypes.bool,
	skinny: PropTypes.bool,
};
export function Chevron({ direction = Down, large, skinny, ...props }) {
	const type = large ? 'large' : skinny ? 'skinny' : 'default';
	const icon = classes[type][direction];

	return <FontIcon icon={icon} {...props} />;
}
