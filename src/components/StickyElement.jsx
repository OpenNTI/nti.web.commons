import React from 'react';
import PropTypes from 'prop-types';
import {Sticky as ReactSticky} from 'react-sticky';

const offsetProp = 'nti-sticky-top-offset';

Sticky.propTypes = {
	children: PropTypes.node
};

export default function Sticky ({children}) {
	const offset = window && window[offsetProp];
	let topOffset = 0;

	if (offset) {
		topOffset = -offset;
	}

	return (
		<ReactSticky topOffset={topOffset}>
			{({style}) => {
				if (offset && style.top != null) {
					style.top += offset;
				}

				return (<div className="sticky" style={style}>{children}</div>);
			}}
		</ReactSticky>
	);
}
