import './NTIContent.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { declareCustomElement } from '@nti/lib-dom';

declareCustomElement('nti:content');

const NTIContent = React.forwardRef(({ className, ...props }, ref) =>
	React.createElement('nti:content', {
		ref,
		class: className, // react can't map custom element's attributes
		is: 'div', //We are using a custom element that mimics a div
		...props,
	})
);

NTIContent.displayName = 'NTIContent';

NTIContent.propTypes = {
	className: PropTypes.string,
};

export default NTIContent;
