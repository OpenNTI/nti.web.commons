import React from 'react';

import {MARKUP_WHITE_LIST} from '../Constants';

const HasAnchorRegex = /<\/?a [^>]*>/i;
const HasNonAnchorMarkup = /<\/?[^a]>/i;

function hasAllowedRawMarkup (text) {
	return HasAnchorRegex.test(text) && !HasNonAnchorMarkup.test(text);
}

function getAttributesFromProps (props) {
	const names = Object.keys(props);
	let attributes = '';

	for (let name of names) {
		if (MARKUP_WHITE_LIST.ATTRIBUTES[name]) {
			const value = props[name];

			attributes += ` ${name}="${value}"`;
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

	if (childProps.hasComponents) { throw new Error('Cannot get markup from components'); }

	const innerHTML = childProps.text ? childProps.text : '';

	return `<${tag}${attributes}>${innerHTML}</${tag}>`;
}

export default function getTextPropsFromChildren (childrenProp, allowAllMarkup) {
	const children = React.Children.toArray(childrenProp);

	let text = '';
	let hasMarkup = allowAllMarkup;
	let hasComponents = false;

	for (let child of children) {
		if (typeof child === 'string') {
			text += child;
			hasMarkup = hasMarkup || hasAllowedRawMarkup(child);
		} else if (typeof child.type === 'string' && MARKUP_WHITE_LIST.TAGS[child.type]) {
			try {
				text += getMarkupFromChild(child);
				hasMarkup = true;
			} catch (e) {
				hasComponents = true;
				text = childrenProp;
				break;
			}
		} else {
			hasComponents = true;
			hasMarkup = false;
			text = childrenProp;
			break;
		}
	}

	return {text, hasMarkup, hasComponents};
}