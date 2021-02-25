import React from 'react';
import { HOC } from '@nti/lib-commons';

import Grid from './Grid';

export default function gridFactory (colsize, gap) {
	const Component = props => <Grid colsize={colsize} gap={gap} {...props} />;
	return HOC.hoistStatics(Component, Grid)
}
