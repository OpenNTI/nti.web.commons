import React from 'react';
import PropTypes from 'prop-types';
import {replaceNode, removeNode} from '@nti/lib-dom';

import ScratchPad from '../../scratch-pad';
import {ForwardRef, ScreenSize} from '../../decorators';
import {Tokens} from '../utils';

const MIRROR_STYLES = [
	'box-sizing',
	'width',
	'height',
	'font-size',
	'font-weight',
	'font-family',
	'font-style',
	'line-height',
	'letter-spacing',
	'text-indent',
	'white-space',
	'word-break',
	'overflow-wrap',
	'padding-left',
	'padding-right',
	'text-transform'
];

function getMirrorStyles (node) {
	const styles = global.getComputedStyle ? global.getComputedStyle(node) : {};

	return MIRROR_STYLES.reduce((acc, style) => ({...acc, [style]: styles[style]}), {});
}

function hasRectAboveBoundary (node, boundary) {
	const rects = Array.from(node.getClientRects());

	for (let rect of rects) {
		if (rect.bottom <= boundary) { return true; }
	}

	return false;
}

function hasRectOutsideBoundary (node, bottom, right) {
	const rect = node.getBoundingClientRect();

	return rect.bottom > bottom || rect.right > right ;
}

export default
@ForwardRef('textRef')
@ScreenSize()
class Overflow extends React.Component {
	static shouldApply ({overflow, hasComponents}) { return overflow != null && !hasComponents; }

	static propTypes = {
		text: PropTypes.string,
		overflow: PropTypes.string,
		children: PropTypes.any,
		textRef: PropTypes.func,
		hasMarkup: PropTypes.bool
	}


	attachText = (node) => {
		const {textRef} = this.props;

		this.textNode = node;
		if (textRef) { textRef(node);}

		setImmediate(() => this.setup());
	}

	state = {}


	componentDidUpdate (prevProps) {
		const {text} = this.props;
		const {text:oldText} = prevProps;

		if (text !== oldText || ScreenSize.didChange(this.props, prevProps)) {
			this.setState({
				overflowed: false,
				text: null
			}, () => setImmediate(() => this.setup()));
		}
	}


	setup () {
		if (!this.textNode) { return null; }

		const {overflow, text} = this.props;

		const needsTruncating = (pad) => {
			const height = pad.clientHeight || pad.offsetHeight;
			const width = pad.clientWidth || pad.offsetWidth;
			const scrollHeight = pad.scrollHeight;
			const scrollWidth = pad.scrollWidth;

			return (scrollHeight - height) > 0 || scrollWidth > width;
		};

		const cleanupTokens = (pad, lowerBound) => {
			const tokens = Tokens.getTokensFromNode(pad);

			for (let token of tokens.reverse()) {
				if (!hasRectAboveBoundary(token, lowerBound)) {
					removeNode(token);
				}
			}
		};

		const addEllipse = (pad, lowerBound, rightBound) => {
			const tokens = Tokens.getTokensFromNode(pad);
			const lastToken = tokens[tokens.length - 1];

			let lastWord = lastToken.innerHTML;

			lastToken.innerHTML = `${lastWord}${overflow}`;

			while (lastWord && hasRectOutsideBoundary(lastToken, lowerBound, rightBound)) {
				lastWord = lastWord.slice(0, -1);
				lastToken.innerHTML = `${lastWord}${overflow}`;
			}
		};

		const removeTokens = (pad) => {
			const tokens = Tokens.getTokensFromNode(pad);

			for (let token of tokens) {
				const textNode = document.createTextNode(token.innerText || token.textContent);

				replaceNode(token, textNode);
			}
		};

		ScratchPad
			.withStyles(getMirrorStyles(this.textNode))
			.work((pad) => {
				pad.innerHTML = Tokens.tokenizeText(text);

				const bounds = pad.getBoundingClientRect();
				const lowerBound = bounds.bottom;
				const rightBound = bounds.right;

				if (!needsTruncating(pad)) { return; }

				cleanupTokens(pad, lowerBound);
				addEllipse(pad, lowerBound, rightBound);
				removeTokens(pad);

				const overflowedText = pad.innerHTML;

				if (overflowedText !== text) {
					this.setState({
						overflowed: true,
						text: pad.innerHTML
					});
				}
			});
	}


	render () {
		const {children, text:fullText, ...otherProps} = this.props;
		const {text, overflowed} = this.state;
		const Text = React.Children.only(children);

		delete otherProps.screenWidth;
		delete otherProps.screenHeight;

		return React.cloneElement(
			Text,
			{
				...otherProps,
				text: text || fullText,
				title: overflowed ? fullText : null,
				hasMarkup: true,
				ref: this.attachText
			}
		);
	}
}
