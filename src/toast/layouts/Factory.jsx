import React from 'react';
import {HOC} from '@nti/lib-commons';

export function Wrap (Parent, Component) {
	const Wrapper = (props, ref) => {
		return (
			<Parent {...props}>
				<Component {...props} ref={ref} />
			</Parent>
		);
	};
	const cmp = React.forwardRef(Wrapper);

	const componentName = Component ? Component.displayName || Component.name : '';
	const parentName = Parent ? Parent.displayName || Parent.name : '';
	const wrapperName = `${parentName}(${componentName})`;

	HOC.hoistStatics(cmp, Component, wrapperName);

	return cmp;
}
