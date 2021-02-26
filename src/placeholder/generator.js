import React from 'react';
import PropTypes from 'prop-types';
import { HOC } from '@nti/lib-commons';

const propTypes = {
	as: PropTypes.shape({
		withComponent: PropTypes.func.isRequired,
	}),
};

export function generator(placeholder) {
	const Generated = ({ as, ...otherProps }) => {
		if (as && !as.withComponent) {
			throw new Error(
				'Invalid "as" prop given to placeholder. Must be a styled component'
			);
		}

		const [Cmp] = React.useState(() => {
			if (!as) {
				return placeholder;
			}

			return as.withComponent(placeholder);
		});

		return <Cmp {...otherProps} />;
	};

	Generated.propTypes = propTypes;

	HOC.hoistStatics(
		Generated,
		placeholder,
		`Placeholder(${placeholder.displayName || placeholder.name})`
	);

	return Generated;
}
