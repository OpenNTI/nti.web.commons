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

export default function Variant (Component, variantProps, name) {
	debugger;
	const VariantWrapper = (props, ref) => {
		return (<Component {...combineProps(variantProps, props)} ref={ref} />);
	};
	const cmp = React.forwardRef(VariantWrapper);

	const componentName = Component ? Component.displayName || Component.name : '';
	const variantName = `${componentName}(${name || 'Variant'})`;

	HOC.hoistStatics(cmp, Component, variantName);

	return cmp;
}