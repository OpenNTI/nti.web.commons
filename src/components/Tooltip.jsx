import PropTypes from 'prop-types';
import React from 'react';

import {Flyout, Text} from '../';

Tooltip.propTypes = {
	tooltip: PropTypes.any.isRequired,
};

export default function Tooltip ({ tooltip:tooltipProp, children, ...otherProps }) {
	const child = React.Children.only(children);

	const isString = typeof tooltipProp === 'string';

	const tooltip = isString ? <Text>{tooltipProp}</Text> : tooltipProp;

	return (
		<Flyout.Triggered dark {...otherProps} hover trigger={child}>
			{tooltip}
		</Flyout.Triggered>
	);
}
