import React from 'react';

import { HOC } from '@nti/lib-commons';

export default function forwardRef(refProp = 'forwardedRef') {
	return Component => {
		const ForwardRefWrapper = (props, ref) => {
			return React.createElement(Component, { ...props, [refProp]: ref });
		};
		const cmp = React.forwardRef(ForwardRefWrapper);

		const typeName = Component
			? Component.displayName || Component.name
			: '';
		const name = `Forwarded-Ref(${typeName})`;

		HOC.hoistStatics(cmp, Component, name);

		return cmp;
	};
}
