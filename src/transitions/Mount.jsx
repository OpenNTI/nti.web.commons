import React from 'react';
import PropTypes from 'prop-types';

import Renders from './Renders';

const DefaultTimeouts = {
	enter: 250,
	exit: 250,
};

ShowTransition.propTypes = {
	children: PropTypes.any,
	mount: PropTypes.bool,
	timeout: PropTypes.any,
};
export default function ShowTransition({
	children,
	mount,
	timeout = DefaultTimeouts,
	...otherProps
}) {
	const renders = { entered: children, exiting: children };

	return (
		<Renders
			in={mount}
			renders={renders}
			timeout={timeout}
			{...otherProps}
		/>
	);
}
