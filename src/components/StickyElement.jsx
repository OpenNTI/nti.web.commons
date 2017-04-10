import React from 'react';
import PropTypes from 'prop-types';
import {Sticky as ReactSticky} from 'react-sticky';

const offsetProp = 'nti-sticky-top-offset';

Sticky.propTypes = {
	children: PropTypes.any
};

export default function Sticky (props) {
	const {children} = props;
	let styles = {};
	let topOffset = 0;

	if (window && window[offsetProp]) {
		topOffset = -window[offsetProp];
		styles.top = window[offsetProp] + 'px';
	}

	return (
		<ReactSticky topOffset={topOffset} stickyStyle={styles}>
			{children}
		</ReactSticky>
	);
}
