import { v4 as uuid } from 'uuid';
import React from 'react';

import { toCSSClassName } from '@nti/lib-dom';

export function useId(namespace) {
	const [id] = React.useState(() => {
		const guid = uuid();
		return !namespace ? guid : `${toCSSClassName(namespace)}-${guid}`;
	});

	return id;
}
