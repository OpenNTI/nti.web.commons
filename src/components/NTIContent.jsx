import React from 'react';
import PropTypes from 'prop-types';
import { declareCustomElement } from '@nti/lib-dom';

declareCustomElement('nti:content');

const NTIContent = ({className, ...props}, ref) => (
	React.createElement('nti:content', {
		ref,
		class: className, // react can't map custom element's attributes
		is: 'div', //We are using a custom element that mimics a div
		...props
	})
);
NTIContent.propTypes = {
	className: PropTypes.string
};

export default React.forwardRef(NTIContent);
