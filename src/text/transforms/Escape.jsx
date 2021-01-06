import React, {useState, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';

const Escape = React.forwardRef(({hasMarkup, children, text, ...props}, ref) => {
	const [escapedText, setText] = useState(text);

	useLayoutEffect(() => {
		const span = document.createElement('span');
		span.appendChild(document.createTextNode(text));
		setText(span.innerHTML);
	}, [text]);

	const escaped = text !== escapedText;
	const Text = React.Children.only(children);
	return React.cloneElement(
		Text,
		{
			...props,
			text: escapedText,
			title: escaped ? text : undefined,
			hasMarkup: hasMarkup || escaped,
			ref
		}
	);
});

Escape.displayName = 'Escape';
Escape.shouldApply = ({hasMarkup, hasComponents}) => !hasMarkup && !hasComponents;
Escape.propTypes = {
	text: PropTypes.string,
	children: PropTypes.any,
	hasComponents: PropTypes.bool,
	hasMarkup: PropTypes.bool
};

export default Escape;
