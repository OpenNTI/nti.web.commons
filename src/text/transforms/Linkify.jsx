import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import linkifyIt from 'linkify-it';

const linkifyUtil = linkifyIt();
const URL_PUNCTUATION_REGEX = /([./])/g;

//https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr#Example
const insertWBR = (linkText) => linkText.replace(URL_PUNCTUATION_REGEX, '<wbr />$1');

function linkifyText (text) {
	const links = linkifyUtil.match(text);

	if (!links || !links.length) {
		return {hasLinks: false, text};
	}

	let processed = '';
	let pointer = 0;

	for (let link of links) {
		const {index, lastIndex, url, text: linkText} = link;
		const pre = text.substring(pointer, index);

		processed += `${pre}<a href="${url}" title="${linkText}">${insertWBR(linkText)}</a>`;
		pointer = lastIndex;
	}

	processed += text.substring(pointer, text.length);

	return {
		hasLinks: true,
		text: processed
	};
}

const Linkify = React.forwardRef(({hasMarkup, children, ...props}, ref) => {
	const [{text, hasLinks}, setState] = useState(linkifyText(props.text));

	useEffect(() => {
		setState(linkifyText(props.text));
	}, [props.text]);

	const Text = React.Children.only(children);
	return React.cloneElement(
		Text,
		{
			...props,
			text,
			hasMarkup: hasLinks || hasMarkup,
			ref
		}
	);
});

Linkify.displayName = 'Linkify';
Linkify.shouldApply = ({linkify, hasComponents}) => linkify && !hasComponents;
Linkify.propTypes = {
	text: PropTypes.string,
	children: PropTypes.any,
	hasMarkup: PropTypes.bool
};

export default Linkify;
