import React from 'react';
import PropTypes from 'prop-types';

import {useResponsiveValue} from '../use-responsive-value';

export default {
	title: 'Hooks/useResponsiveValue',
	component: useResponsiveValue,
	argTypes: {
		breakPoint: {
			defaultValue: 600,
			control: {
				type: 'number'
			}
		}
	}
};

export const Base = ({breakPoint}) => {
	const query = `(min-width: ${breakPoint}px)`;
	const text = useResponsiveValue(query, 'Large', 'Small');

	return (
		<p>
			{text}
		</p>
	);
};

Base.propTypes = {
	breakPoint: PropTypes.number
};
