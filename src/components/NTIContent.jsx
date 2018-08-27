import React from 'react';
import { declareCustomElement } from '@nti/lib-dom';

declareCustomElement('nti:content');

export default React.forwardRef(({ className, ...props }, ref) =>
	React.createElement('nti:content', {
		ref,
		class: className, // react can't map custom element's attributes
		is: 'div', //We are using a custom element that mimics a div
		...props
	}));
