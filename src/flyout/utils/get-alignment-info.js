import {
	getElementRect as getRectInViewport,
	getViewportHeight,
	getViewportWidth
} from '@nti/lib-dom';


function hasFixedPosition (el) {
	return el && el.getAttribute && getComputedStyle(el).position === 'fixed';
}

function isFixed (el) {
	while (el && !hasFixedPosition(el)) {
		el = el.offsetParent;
	}

	return hasFixedPosition(el);
}

function getRelativeRect (elementRect, parentRect) {
	const {width, height} = elementRect;
	const top = elementRect.top - parentRect.top;
	const left = elementRect.left - parentRect.left;

	return {
		top,
		left,
		right: left + width,
		bottom: top + height,
		width, height
	};
}

function getBodyDocumentGaps () {
	if (typeof document === 'undefined') { return {top: 0, left: 0}; }

	const a = document.body.getBoundingClientRect();
	const b = document.body.parentNode.getBoundingClientRect();

	return getRelativeRect(a, b);
}


function getBodySize () {
	if (typeof document === 'undefined') { return {width: 0, height: 0, top: 0, left: 0}; }

	const el = document.body;
	const getDim = x => Math.max(el[`client${x}`], el[`offset${x}`]);
	const tl = getBodyDocumentGaps();

	return {
		height: getDim('Height'),
		width: getDim('Width'),
		...tl
	};
}


function getViewportRect () {
	const width = getViewportWidth();
	const height = getViewportHeight();
	const {top, left} = getBodyDocumentGaps();

	return {
		top,
		left,
		right: left + width,
		bottom: top + height,
		width, height
	};
}


function getAlignmentInfoForParent (alignTo, parent) {
	const alignToRect = alignTo.getBoundingClientRect();
	const parentRect = parent.getBoundingClientRect();
	const relativeRect = getRelativeRect(alignToRect, parentRect);

	return {
		alignToRect: relativeRect,
		viewport: parentRect,
		coordinateRoot: parentRect
	};
}

function getAlignmentInViewport (alignTo) {
	const alignToRect = getRectInViewport(alignTo);
	const parentRect = getViewportRect();

	return {
		alignToRect,
		viewport: parentRect,
		coordinateRoot: parentRect,
		isFixed: true
	};
}


function getRectInDocument (el) {
	const offsetParent = e => e && e.offsetParent;
	const parentNode = e => e && e.parentNode && e.parentNode.tagName !== 'BODY' && e.parentNode;

	const offsetParents = e => (offsetParent(e) ? [e].concat(offsetParents(offsetParent(e))) : [e]);
	const parentNodes = e => (parentNode(e) ? [e].concat(parentNodes(parentNode(e))) : [e]);

	const sum = (prop) => {
		return (acc, e) => {
			acc.top += e[`${prop}Top`];
			acc.left += e[`${prop}Left`];

			return acc;
		};
	};

	const offset = offsetParents(el).reduce(sum('offset'), {top: 0, left: 0});
	const scrolls = parentNodes(el).reduce(sum('scroll'), {top: 0, left: 0});

	const top = offset.top - scrolls.top;
	const left = offset.left - scrolls.left;

	const width = el.offsetWidth;
	const height = el.offsetHeight;

	const alignToRect = {
		top,
		left,
		right: left + width,
		bottom: top + height,
		width,
		height
	};

	return {
		alignToRect,
		viewport: getViewportRect(),
		coordinateRoot: getBodySize()
	};
}


export default function getAlignmentInfo (alignTo, parent) {
	if (parent) { return getAlignmentInfoForParent(alignTo, parent); }

	if (isFixed(alignTo)) { return getAlignmentInViewport(alignTo); }

	return getRectInDocument(alignTo);
}
