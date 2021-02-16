import React from 'react';
import PropTypes from 'prop-types';

const StandardComponent = React.forwardRef(
	({ as: tag, ...otherProps }, ref) => {
		const Cmp = tag || 'div';

		return <Cmp {...otherProps} ref={ref} />;
	}
);

StandardComponent.displayName = 'StandardComponent';
StandardComponent.propTypes = {
	as: PropTypes.any,
};

export default StandardComponent;
