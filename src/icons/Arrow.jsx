import React from 'react';
import PropTypes from 'prop-types';

import { Variant } from '../HighOrderComponents';

import FontIcon from './Font-Icon';

const Up = 'up';
const UpRight = 'up-right';
// const Right = 'right';
// const DownRight = 'down-right';
const Down = 'down';
// const DownLeft= 'down-left';
// const Left = 'left';
// const UpLeft = 'up-left';

const classes = {
	[UpRight]: 'icon-launch',
};

const fillClasses = {
	[Up]: 'icon-moveup',
	[Down]: 'icon-movedown',
};

Arrow.Up = Variant(Arrow, { direction: Up });
Arrow.UpRight = Variant(Arrow, { direction: UpRight });
Arrow.Down = Variant(Arrow, { direction: Down });
Arrow.propTypes = {
	direction: PropTypes.string,
	fill: PropTypes.bool,
};
export function Arrow({ direction = UpRight, fill, ...otherProps }) {
	const icon = fill ? fillClasses[direction] : classes[direction];

	if (!icon) {
		return null;
	}

	return <FontIcon icon={icon} {...otherProps} />;
}

Arrow.Up.propTypes = Arrow.propTypes;
Arrow.UpRight.propTypes = Arrow.propTypes;
Arrow.Down.propTypes = Arrow.propTypes;
