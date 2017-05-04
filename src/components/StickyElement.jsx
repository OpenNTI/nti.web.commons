import React from 'react';
import PropTypes from 'prop-types';
import {Sticky as ReactSticky} from 'react-sticky';

const offsetProp = 'nti-sticky-top-offset';

Sticky.propTypes = {
	children: PropTypes.node
};

export default function Sticky ({children}) {
	let containerStyles = {};
	let topOffset = 0;

	if (window && window[offsetProp]) {
		topOffset = -window[offsetProp];
		containerStyles.top = window[offsetProp] + 'px';
	}

	return (
		<ReactSticky topOffset={topOffset} stickyStyle={containerStyles}>
			{({style}) => <div style={style}>{children}</div>}
		</ReactSticky>
	);
}
