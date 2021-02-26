import React from 'react';

import { generator } from './generator';

function ContainerPlaceholder({ ...otherProps }) {
	return <div {...otherProps} />;
}

export const Container = generator(ContainerPlaceholder);
