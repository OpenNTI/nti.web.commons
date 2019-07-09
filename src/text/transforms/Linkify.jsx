import React from 'react';
import PropTypes from 'prop-types';
import linkifyIt from 'linkify-it';

import {ForwardRef} from '../../decorators';

const linkifyUtil = linkifyIt();
const URL_PUNCUATION_REGEX = /([./])/g;

//https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr#Example
function insertWBRS (linkText) {
	return linkText.replace(URL_PUNCUATION_REGEX, '<wbr />$1');
}

function linkifyText (text) {
	const links = linkifyUtil.match(text);

	if (!links || !links.length) {
		return {hasLinks: false, text};
	}

	let linkified = '';
	let pointer = 0;

	for (let link of links) {
		const {index, lastIndex, url, text: linkText} = link;
		const pre = text.substring(pointer, index);

		linkified += `${pre}<a href="${url}" rel="noopener nofollow">${insertWBRS(linkText)}</a>`;
		pointer = lastIndex;
	}

	linkified += text.substring(pointer, text.length);

	return {
		hasLinks: true,
		text: linkified
	};
}

export default
@ForwardRef('textRef')
class Linkify extends React.Component {
	static shouldApply ({linkify, hasComponents}) { return linkify != null && !hasComponents; }

	static propTypes = {
		text: PropTypes.string,
		textRef: PropTypes.func,
		children: PropTypes.any,
		hasMarkup: PropTypes.bool
	}

	constructor (props) {
		super(props);

		this.state = {
			...linkifyText(props.text)
		};
	}

	componentDidUpdate (prevProps) {
		const {text} = this.props;
		const {text:oldText} = prevProps;

		if (text !== oldText) {
			this.setState({
				...linkifyText(text)
			});
		}
	}


	render () {
		const {textRef, hasMarkup, children, ...otherProps} = this.props;
		const {text, hasLinks} = this.state;
		const Text = React.Children.only(children);

		delete otherProps.linkify;

		return React.cloneElement(
			Text,
			{
				...otherProps,
				text,
				hasMarkup: hasLinks || hasMarkup,
				ref: textRef
			}
		);
	}
}