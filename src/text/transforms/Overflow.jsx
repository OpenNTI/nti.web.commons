import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import ScratchPad from '../../scratch-pad';
import { ScreenSize } from '../../decorators';
import { updateRef } from '../utils';

import {
	addTokens,
	needsTruncating,
	cleanupTokens,
	addEllipse,
	removeTokens,
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
	'hyphens',
];

// const RESET_STATE = { overflowed: false, text: null };

const Overflow = React.forwardRef(
	(
		{
			children,
			overflow,
			text: fullText,
			screenHeight,
			screenWidth,
			...props
		},
		ref
	) => {
		const textNode = useRef();
		const fullTextNode = useRef();
		const [{ text, overflowed }, setState] = useState({});

		const processText = node => {
			textNode.current = node;
			updateRef(ref, node);
		};

		useLayoutEffect(() => {
			setState({});
			fullTextNode.current = textNode.current?.innerHTML;
		}, [fullText, screenWidth]);

		useLayoutEffect(() => {
			const { current: node } = textNode;
			const { current: scratch } = fullTextNode;
			if (!node || !scratch) {
				return;
			}

			let cancel = false;
			ScratchPad.mirrorStyles(node, MIRROR_STYLES).work(pad => {
				addTokens(pad, scratch);

				const bounds = pad.getBoundingClientRect();
				const buffer = 2; //This was determined experimentally, I'm not really sure why its needed or why 2 seems to work.
				const lowerBound = bounds.bottom + buffer;
				const rightBound = bounds.right;

				if (!needsTruncating(pad, buffer) || cancel) {
					return;
				}

				cleanupTokens(pad, lowerBound, rightBound);
				addEllipse(overflow, pad, lowerBound, rightBound);
				removeTokens(pad);

				const overflowedText = pad.innerHTML;

				if (overflowedText !== scratch && !cancel) {
					setState({
						overflowed: true,
						text: pad.innerHTML,
					});
				}
			});

			return () => {
				cancel = true;
			};
		}, [text == null, screenWidth, screenHeight]);

		const Text = React.Children.only(children);

		return React.cloneElement(Text, {
			...props,
			text: text || fullText,
			title: props.title ?? (overflowed ? fullText : null),
			hasMarkup: props.hasMarkup || overflowed,
			ref: processText,
		});
	}
);

Overflow.shouldApply = ({ overflow, hasComponents }) =>
	overflow != null && !hasComponents;
Overflow.displayName = 'Overflow';
Overflow.propTypes = {
	text: PropTypes.string,
	title: PropTypes.string,
	overflow: PropTypes.string,
	children: PropTypes.any,
	hasMarkup: PropTypes.bool,

	//from ScreenSize decorator
	screenWidth: PropTypes.any,
	screenHeight: PropTypes.any,
};

export default ScreenSize()(Overflow);
