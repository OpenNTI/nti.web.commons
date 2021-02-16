/**
 * These function are not idempotent, they are mutating the dom node that is
 * passed to them. They are only meant to be used by the Overflow component.
 * They are being exported from this util file, solely for testing purposes.
 *
 * If you need something out of here, it should be moved to a different location
 * and be imported here.
 */
import { replaceNode, removeNode } from '@nti/lib-dom';

import { Tokens } from '../utils';

/**
 * Detect if any part of the node is completely above the boundary
 * @param  {Element}  node     the element to check
 * @param  {number}  boundary the lower bound to check against
 * @returns {boolean}          if any part of the node is completely above the boundary
 */
function hasRectAboveBoundary(node, boundary) {
	const rects = Array.from(node.getClientRects());

	for (let rect of rects) {
		if (rect.bottom <= boundary) {
			return true;
		}
	}

	return false;
}

function hasRectRightOfBoundary(node, boundary) {
	const rects = Array.from(node.getClientRects());

	for (let rect of rects) {
		if (rect.right > boundary) {
			return true;
		}
	}

	return false;
}

function hasRectOutsideBoundary(node, bottom, right) {
	const rect = node.getBoundingClientRect();

	return rect.bottom > bottom || rect.right > right;
}

export function addTokens(pad, text) {
	pad.innerHTML = Tokens.tokenizeText(text);
}

export function needsTruncating(pad, buffer) {
	const height = pad.clientHeight || pad.offsetHeight;
	const width = pad.clientWidth || pad.offsetWidth;
	const scrollHeight = pad.scrollHeight;
	const scrollWidth = pad.scrollWidth;

	return scrollHeight - height > buffer || scrollWidth > width;
}

/**
 * Removes all the words after the first one that is
 * overflowing the bounds. It leave that first overflowing
 * word, because when we go to truncate it might become
 * small enough to fit on the previous line.
 *
 * @param  {Element} pad        the element to remove words from
 * @param  {number} lowerBound  marks the lower bound for container
 * @param  {number} rightBound  marks the right bound for container
 * @returns {void}
 */
export function cleanupTokens(pad, lowerBound, rightBound) {
	const tokens = Tokens.getTokensFromNode(pad);
	let overflown = false;

	for (let token of tokens) {
		if (overflown) {
			removeNode(token);
		} else if (overflown || !hasRectAboveBoundary(token, lowerBound)) {
			overflown = true;
		} else if (hasRectRightOfBoundary(token, rightBound)) {
			overflown = true;
		}
	}
}

export function addEllipse(ellipse, pad, lowerBound, rightBound) {
	const tokens = Tokens.getTokensFromNode(pad);

	if (!tokens.length) {
		return;
	}

	const lastToken = tokens[tokens.length - 1];

	let lastWord = lastToken.innerHTML;

	lastToken.innerHTML = `${lastWord}${ellipse}`;

	while (hasRectOutsideBoundary(lastToken, lowerBound, rightBound)) {
		lastWord = lastWord.slice(0, -1);

		if (lastWord === '') {
			removeNode(lastToken);
			return addEllipse(ellipse, pad, lowerBound, rightBound);
		}

		lastToken.innerHTML = `${lastWord}${ellipse}`;
	}
}

export function removeTokens(pad) {
	const tokens = Tokens.getTokensFromNode(pad);

	for (let token of tokens) {
		const textNode = document.createTextNode(
			token.innerText || token.textContent
		);

		replaceNode(token, textNode);
	}
}
