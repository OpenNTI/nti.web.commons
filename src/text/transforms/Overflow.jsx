import React from 'react';
import PropTypes from 'prop-types';

import ScratchPad from '../../scratch-pad';
import {ForwardRef, ScreenSize} from '../../decorators';

import {
	addTokens,
	needsTruncating,
	cleanupTokens,
	addEllipse,
	removeTokens
} from './overflow-utils';

const MIRROR_STYLES = [
	'display',
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
	'text-transform',
	'hyphens'
];

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

		ScratchPad
			.mirrorStyles(this.textNode, MIRROR_STYLES)
			.work((pad) => {
				addTokens(pad, text);

				const bounds = pad.getBoundingClientRect();
				const buffer = 2;//This was determined experimentally, I'm not really sure why its needed or why 2 seems to work.
				const lowerBound = bounds.bottom + buffer;
				const rightBound = bounds.right;

				if (!needsTruncating(pad, buffer)) { return; }

				cleanupTokens(pad, lowerBound, rightBound);
				addEllipse(overflow, pad, lowerBound, rightBound);
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
