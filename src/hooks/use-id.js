import { v4 as uuid } from 'uuid';
import { useState } from 'react';

import { toCSSClassName } from '@nti/lib-dom';

export function useId(namespace = 'id') {
	const [id] = useState(() => {
		const guid = uuid().replace(/-/g, '');
		return `${toCSSClassName(namespace)}-${guid}`;
	});

	return id;
}
