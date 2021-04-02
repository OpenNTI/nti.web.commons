import React from 'react';
import PropTypes from 'prop-types';

import { filterProps } from '../utils';

const StandardComponent = React.forwardRef(
	({ as: tag, ...otherProps }, ref) => {
		const Cmp = tag || 'div';

		return <Cmp {...filterProps(otherProps, Cmp)} ref={ref} />;
	}
);

StandardComponent.displayName = 'StandardComponent';
StandardComponent.propTypes = {
	as: PropTypes.any,
};

export default StandardComponent;
