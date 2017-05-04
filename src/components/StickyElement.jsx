import React from 'react';
import PropTypes from 'prop-types';
import {Sticky as ReactSticky} from 'react-sticky';

const offsetProp = 'nti-sticky-top-offset';

Sticky.propTypes = {
	children: PropTypes.node
};

export default function Sticky (props) {
	const child = React.Children.only(props.children);
	let containerStyles = {};
	let topOffset = 0;

	if (window && window[offsetProp]) {
		topOffset = -window[offsetProp];
		containerStyles.top = window[offsetProp] + 'px';
	}

	return (
		<ReactSticky topOffset={topOffset} stickyStyle={containerStyles}>
			{({style}) => React.cloneElement(child, {style: {...(child.props.style || {}), ...style}})}
		</ReactSticky>
	);
}
