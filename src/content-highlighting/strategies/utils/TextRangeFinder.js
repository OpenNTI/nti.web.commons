/*
 * Ported from @nti/web-app/src/main/js/legacy/util/TextRangeFinder.js
 *
 *
 * These functions are a heavily modified version of Raymond Hill's doHighlight code. Attribution below
 *
 * Author: Raymond Hill
 * Version: 2011-01-17
 * Title: HTML text hilighter
 * Permalink: http://www.raymondhill.net/blog/?p=272
 * Purpose: Hilight portions of text inside a specified element, according to a search expression.
 * Key feature: Can safely hilight text across HTML tags.
 * History:
 *	 2012-01-29
 *	   fixed a bug which caused special regex characters in the
 *	   search string to break the highlighter
 */
import { parent } from '@nti/lib-dom';

function allButObjects(child) {
	return !parent(child, 'object');
}

//Returns an object with two properties indices
//and text.	 If nodeFilterFn is provided it will
//be called with each node before it is indexed.  nodes returning
//true will be indexed
export function indexText(node, nodeFilterFn) {
	let indices = [];
	let text = []; //will be morphed into a string later
	let stack = [];

	let iNode = 0;
	let nNodes = node.childNodes.length;
	let textLength = 0;
	let child = null;
	let nChildren = null;

	//collect text and index-node pairs
	for (;;) {
		while (iNode < nNodes) {
			child = node.childNodes[iNode++];

			//text: collect and save index-node pare
			if (child.nodeType === 3) {
				if (nodeFilterFn && !nodeFilterFn(child)) {
					continue;
				}

				indices.push({ i: textLength, n: child });

				const nodeText = child.nodeValue;

				text.push(nodeText);
				textLength += nodeText.length;
			}
			//element: collect text of child elements,
			//except from script or style
			else if (child.nodeType === 1) {
				// skip style/script tags
				if (child.tagName.search(/^(script|style)$/i) >= 0) {
					continue;
				}

				// add extra space for tags which fall naturally on word boundaries
				if (
					child.tagName.search(
						/^(a|b|basefont|bdo|big|em|font|i|s|small|span|strike|strong|su[bp]|tt|u)$/i
					) < 0
				) {
					text.push(' ');
					textLength++;
				}

				// save parent's loop state
				nChildren = child.childNodes.length;
				if (nChildren) {
					stack.push({ n: node, l: nNodes, i: iNode });
					// initialize child's loop
					node = child;
					nNodes = nChildren;
					iNode = 0;
				}
			}
		}

		// restore parent's loop state
		if (!stack.length) {
			break;
		}

		const state = stack.pop();
		node = state.n;
		nNodes = state.l;
		iNode = state.i;
	}

	// quit if found nothing
	if (!indices.length) {
		return null;
	}

	// morph array of text into contiguous text
	text = text.join('');

	// sentinel
	indices.push({ i: text.length });

	return { text: text, indices: indices };
}

export function searchForEntry(start, end, lookFor, array, endEdge) {
	let i = null;

	while (start < end) {
		i = (start + end) >> 1;

		if (lookFor < array[i].i + (endEdge ? 1 : 0)) {
			end = i;
		} else if (lookFor >= array[i + 1].i + (endEdge ? 1 : 0)) {
			start = i + 1;
		} else {
			start = end = i;
		}
	}

	return start;
}

export function mapMatchToTextRange(match, whichGroup, textIndex, doc) {
	if (!match[whichGroup].length) {
		throw new Error('No match for group');
	}

	//calculate a span from the absolute indices
	//for the start and end of match
	const { indices } = textIndex;

	let textStart = match.index;

	for (let i = 1; i < whichGroup; i++) {
		textStart += match[i].length;
	}

	let textEnd = textStart + match[whichGroup].length;

	let entryLeftIndex = searchForEntry(0, indices.length, textStart, indices);
	let entryRightIndex = searchForEntry(
		entryLeftIndex,
		indices.length,
		textEnd,
		indices,
		true
	);

	let entryLeft = indices[entryLeftIndex];
	let entryRight = indices[entryRightIndex];
	let nodeTextStart = textStart - entryLeft.i;
	let nodeTextEnd = textEnd - entryRight.i;

	let range = doc.createRange();
	range.setStart(entryLeft.n, Math.max(nodeTextStart, 0));
	range.setEnd(entryRight.n, nodeTextEnd);

	return range;
}

// const normalizeNode = (node) => node;
const normalizeDoc = (node, doc) => doc ?? node.ownerDocument;
//normalize search arguments, here is what is accepted:
// - single string
// - single regex (optionally, a 'which' argument default to 0)
const normalizeSearchFor = (node, doc, searchFor) => {
	if (typeof searchFor === 'string') {
		// rhill 2012-01-29: escape regex chars first
		// http://stackoverflow.com/questions/280793/case-insensitive-string-replacement-in-javascript
		searchFor = new RegExp(
			searchFor.replace(/[.*+?|()[\]{}\\$^]/g, '\\$&'),
			'ig'
		);
	}

	return searchFor;
};
const normalizeWhich = (node, doc, searchFor, which) => {
	which = which ?? 0;

	if (!Array.isArray(which)) {
		which = [which];
	}

	return which.sort();
};

const normalizeTextIndex = (node, doc, searchFor, which, textIndex) =>
	textIndex ?? indexText(node, allButObjects);

/**
 * @param {Node} node - the node to search for ranges beneath
 * @param {document} doc - the document fragment node is a child of
 * @param {string} searchFor - a string or a regex to search for
 * @param {number} [which] - if provided the subexpression of the regex to be matched or an array of subexpression idexes
 * @param {number} [textIndex]
 * Note cutz: for the which param to work it expects each part of your regex to be captured
 * IE if your goal is to have a capture in the middle of the regex you must also capture the first portion prior to it
 *
 * @returns {Range[]} a list of range objects that represent the portion of text to highlight
 **/
export function findTextRanges(...args) {
	// const node = normalizeNode(...args);
	const doc = normalizeDoc(...args);
	const searchFor = normalizeSearchFor(...args);
	const which = normalizeWhich(...args);
	const textIndex = normalizeTextIndex(...args);

	if (!textIndex) {
		return [];
	}

	let ranges = [];
	let quit = false;

	//loop until no more matches
	for (;;) {
		//find matching text, stop if none
		const matchingText = searchFor.exec(textIndex.text);

		if (!matchingText || matchingText.length <= which[which.length - 1]) {
			break;
		}

		quit = false;

		//loop over the which capture groups
		for (let whichGroup of which) {
			try {
				const range = mapMatchToTextRange(
					matchingText,
					whichGroup,
					textIndex,
					doc
				);

				if (range) {
					ranges.push(range);
				}
			} catch (e) {
				quit = true;
				break;
			}
		}

		//TODO should we just continue here?  The original
		//implementation stops all work here but that may
		//not be what we want
		if (quit) {
			break;
		}
	}

	return ranges;
}
