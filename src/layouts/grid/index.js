import React from 'react';
import { HOC } from '@nti/lib-commons';

import { useMediaQuery } from '../../hooks';

import Grid from './Grid';

export default function gridFactory(columnWidth, gap = 0) {
	const Component = props => {
		// occupy full width if there isn't room for more than one column
		const colsize = useMediaQuery(`(max-width: ${columnWidth * 2 + gap}px)`)
			.matches
			? '100%'
			: columnWidth;

		return <Grid colsize={colsize} gap={gap} {...props} />;
	};
	return HOC.hoistStatics(Component, Grid);
}
