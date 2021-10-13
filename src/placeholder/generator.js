import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { HOC } from '@nti/lib-commons';

const propTypes = {
	as: PropTypes.shape({
		withComponent: PropTypes.func.isRequired,
	}),
};

export function generator(placeholder) {
	const Generated = ({ as: typeReplacement, ...otherProps }) => {
		if (typeReplacement && !typeReplacement.withComponent) {
			throw new Error(
				'Invalid "as" prop given to placeholder. Must be a styled component'
			);
		}

		const Type = useMemo(
			() => typeReplacement?.withComponent?.(placeholder) ?? placeholder,
			[typeReplacement]
		);

		return <Type {...otherProps} />;
	};

	Generated.propTypes = propTypes;

	HOC.hoistStatics(
		Generated,
		placeholder,
		`Placeholder(${placeholder.displayName || placeholder.name})`
	);

	return Generated;
}
