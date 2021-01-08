import PropTypes from 'prop-types';
import React from 'react';

import {Flyout} from '../index';

ToolTip.propTypes = {
	tooltip: PropTypes.string.isRequired,
};

export default function ToolTip ({ tooltip, children }) {
	const child = React.Children.only(children);

	return (
		<Flyout.Triggered hover trigger={child}>
			{tooltip}
		</Flyout.Triggered>
	);
}
