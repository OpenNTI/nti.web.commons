import React from 'react';
import cx from 'classnames';
import {HOC} from '@nti/lib-commons';

function combineProps (a, b) {
	const combined = {...a, ...b};

	if (a.className != null && b.className != null) {
		combined.className = cx(a.className, b.className);
	}

	if (a.style != null && b.style != null) {
		combined.style = {...a.style, ...b.style};
	}

	return combined;
}

Variant.combineProps = combineProps;
export default function Variant (Component, variantProps, name) {
	const VariantWrapper = (props, ref) => {
		const combinedProps = typeof variantProps === 'function' ? variantProps(props) : combineProps(variantProps, props);

		return (<Component {...combinedProps} ref={ref} />);
	};
	const cmp = React.forwardRef(VariantWrapper);

	const componentName = Component ? Component.displayName || Component.name : '';
	const variantName = `${componentName}(${name || 'Variant'})`;

	HOC.hoistStatics(cmp, Component, variantName);

	return cmp;
}
