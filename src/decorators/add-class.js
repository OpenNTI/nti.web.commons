import React from 'react';

import { HOC } from '@nti/lib-commons';

import { useExternClassName } from '../hooks/use-extern-class-name';

export default function addClass(node, className) {
	if (!node) {
		throw new Error(
			'addClass decorator must be provided a node to add the class to.'
		);
	}
	if (!className) {
		throw new Error('addClass decorator must be provided a class to add.');
	}

	return function factory(Component) {
		const cmp = React.forwardRef((props, ref) => {
			useExternClassName(className, node);
			return <Component {...props} ref={ref} />;
		});

		return HOC.hoistStatics(cmp, Component, 'addClass');
	};
}
