import React from 'react';

import {MARKUP_WHITE_LIST} from '../Constants';

function getAttributesFromProps (props) {
	const names = Object.keys(props);
	let attributes = '';

	for (let name of names) {
		if (MARKUP_WHITE_LIST.ATTRIBUTES[name]) {
			const value = props[name];

			attributes += `${name}="${value}" `;
		}
	}

	return attributes;
}

function getMarkupFromChild (child) {
	const {type, props} = child;
	const {children, ...attrProps} = props || {};

	const tag = type;
	const attributes = getAttributesFromProps(attrProps);
	const childProps = children ? getTextPropsFromChildren(children) : {};
	const innerHTML = childProps.text ? childProps.text : '';

	return `<${tag} ${attributes}>${innerHTML}</${tag}>`;
}

export default function getTextPropsFromChildren (childrenProp) {
	const children = React.Children.toArray(childrenProp);

	let text = '';
	let hasMarkup = false;
	let hasComponents = false;

	for (let child of children) {
		if (typeof child === 'string') {
			text += child;
		} else if (typeof child.type === 'string' && MARKUP_WHITE_LIST.TAGS[child.type]) {
			hasMarkup = true;
			text += getMarkupFromChild(child);
		} else {
			hasComponents = true;
			text = childrenProp;
			break;
		}
	}

	return {text, hasMarkup, hasComponents};
}