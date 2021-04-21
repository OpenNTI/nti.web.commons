import React from 'react';
import Tooltip from '@reach/tooltip';
import '@reach/tooltip/styles.css';

import Text from '../text/index.js';

export default styled(Tooltip).attrs(({ label, ...props }) => ({
	...props,
	position: positionTooltip,
	label:
		typeof label === 'string'
			? React.createElement(Text, {}, label)
			: label,
}))`
	background-color: var(--primary-grey);
	border-color: var(--primary-grey);
	padding: 3px 5px;
	box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.25);
	text-transform: uppercase;
	color: #fff;
	font-size: 11px;
	font-weight: 600;
`;

// The default positioning of the tooltip doesn't account for body being offset...
// we opened an issue, and they closed/resolved it with this custom position function:
// https://github.com/reach/reach-ui/issues/765#issuecomment-810296590
const OFFSET_DEFAULT = 8;

function positionTooltip(triggerRect, tooltipRect, offset = OFFSET_DEFAULT) {
	// account for top offset due to sticky navigation bar
	offset -= parseInt(
		getComputedStyle(document.body).getPropertyValue('--nt-app-top-offset'),
		10
	);
	const {
		width: windowWidth,
		height: windowHeight,
	} = getDocumentDimensions();

	if (!triggerRect || !tooltipRect) {
		return {};
	}

	const collisions = {
		top: triggerRect.top - tooltipRect.height < 0,
		right: windowWidth < triggerRect.left + tooltipRect.width,
		bottom: windowHeight < triggerRect.bottom + tooltipRect.height + offset,
		left: triggerRect.left - tooltipRect.width < 0,
	};

	const directionRight = collisions.right && !collisions.left;
	const directionUp = collisions.bottom && !collisions.top;

	return {
		left: directionRight
			? `${triggerRect.right - tooltipRect.width + window.pageXOffset}px`
			: `${triggerRect.left + window.pageXOffset}px`,
		top: directionUp
			? `${
					triggerRect.top -
					offset -
					tooltipRect.height +
					window.pageYOffset
			  }px`
			: `${
					triggerRect.top +
					offset +
					triggerRect.height +
					window.pageYOffset
			  }px`,
	};
}

function getDocumentDimensions(element) {
	if (typeof document === 'undefined') {
		return {
			width: 0,
			height: 0,
		};
	}

	return {
		width: document.documentElement.clientWidth ?? window.innerWidth,
		height: document.documentElement.clientHeight ?? window.innerHeight,
	};
}
