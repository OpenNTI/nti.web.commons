import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { getEffectiveScreenSize } from './utils';

ResponsiveItem.propTypes = {
	query: PropTypes.func.isRequired,

	component: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
	render: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),

	additionalArguments: PropTypes.object,
};

export default function ResponsiveItem({
	query,
	component,
	render,
	additionalArguments,
	...props
}) {
	const [visible, setVisible] = useState();

	if (!component && !render) {
		throw new Error(
			'Must have a component or render prop for a ResponsiveItem'
		);
	}

	const { width, height } = getEffectiveScreenSize();

	useEffect(() => {
		setVisible(
			query({
				screenSize: {
					width,
					height,
				},
				...additionalArguments,
			})
		);
	}, [query, width, height, additionalArguments]);

	if (!visible) {
		return null;
	}

	return component
		? React.isValidElement(component)
			? React.cloneElement(component, props)
			: React.createElement(component, props)
		: render
		? React.isValidElement(render)
			? React.cloneElement(render, props)
			: render(props)
		: null;
}
