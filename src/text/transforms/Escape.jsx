import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

const Escape = React.forwardRef(
	({ hasMarkup, hasComponents, children, text, ...props }, ref) => {
		const Text = React.Children.only(children);

		const isString = typeof text === 'string';
		const [escapedText, setText] = useState(text);

		useLayoutEffect(() => {
			if (!isString) {
				return;
			}

			const span = document.createElement('span');
			span.appendChild(document.createTextNode(text));
			setText(span.innerHTML);
		}, [text]);

		if (!isString || hasMarkup || hasComponents) {
			return React.cloneElement(Text, {
				...props,
				text,
				hasMarkup,
				hasComponents,
				ref,
			});
		}

		const escaped = text !== escapedText;
		return React.cloneElement(Text, {
			...props,
			text: escapedText,
			title: escaped ? text : undefined,
			hasMarkup: hasMarkup || escaped,
			ref,
		});
	}
);

Escape.displayName = 'Escape';
Escape.shouldApply = ({ hasMarkup, hasComponents }) =>
	!hasMarkup && !hasComponents;
Escape.propTypes = {
	text: PropTypes.node,
	children: PropTypes.any,
	hasComponents: PropTypes.bool,
	hasMarkup: PropTypes.bool,
};

export default Escape;
