import {toCSSClassName} from '@nti/lib-dom';
import {v4 as uuid} from 'uuid';
import React from 'react';

export function useId (namespace) {
	const [id] = React.useState(() => {
		const guid = uuid();

		if (!namespace) { return guid; }

		return `${toCSSClassName(namespace)}-${guid}`;
	});

	return id;
}
