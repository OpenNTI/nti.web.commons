import React from 'react';

export default function getTextFromChildren (children) {
	let text = '';

	React.Children.map(children, (child) => {
		if (typeof child === 'string') {
			text += child;
		}

		//TODO: add mark up if any children have html tags
	});

	return text;
}