import React from 'react';
import PropTypes from 'prop-types';

import { rawContent } from '@nti/lib-commons';

import { updateRef } from '../utils';

import Base from './Base';
import Registry from './Registry';

const isMarkup = ({ text, hasMarkup, hasComponents }) =>
	typeof text === 'string' && hasMarkup && !hasComponents;

function fixAnchor(anchor) {
	if (global.location && global.location.host === anchor.host) {
		return;
	}

	anchor.setAttribute('target', '_blank');
	anchor.setAttribute('rel', 'noopener nofollow');
}

function fixMarkup(node) {
	const anchors = node.querySelectorAll('a[href]') || [];

	for (let anchor of anchors) {
		fixAnchor(anchor);
	}
}

const NTIMarkupText = React.forwardRef(({ text, ...otherProps }, ref) => {
	const processRef = React.useCallback(
		node => {
			updateRef(ref, node);

			if (node) {
				fixMarkup(node);
			}
		},
		[ref]
	);

	return <Base {...otherProps} ref={processRef} {...rawContent(text)} />;
});

NTIMarkupText.displayName = 'NTIMarkupText';
NTIMarkupText.propTypes = {
	text: PropTypes.string,
};

Registry.register(isMarkup)(NTIMarkupText);
export default NTIMarkupText;
