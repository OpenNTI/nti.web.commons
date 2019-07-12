import React from 'react';
import PropTypes from 'prop-types';
import {rawContent} from '@nti/lib-commons';

import {ForwardRef} from '../../decorators';

import Base from './Base';
import Registry from './Registry';

function isMarkup ({text, hasMarkup, hasComponents}) {
	return typeof text === 'string' && hasMarkup && !hasComponents;
}

function fixAnchor (anchor) {
	if (global.location && global.location.host === anchor.host) { return; }

	anchor.setAttribute('target', '_blank');
	anchor.setAttribute('rel', 'noopener nofollow');
}

function fixMarkup (node) {
	const anchors = Array.from(node.querySelectorAll('a[href]'));

	for (let anchor of anchors) {
		fixAnchor(anchor);
	}
}

export default
@Registry.register(isMarkup)
@ForwardRef('textRef')
class NTIMarkupText extends React.Component {
	static propTypes = {
		text: PropTypes.string,
		textRef: PropTypes.func
	}

	attachRef = (node) => {
		const {textRef} = this.props;

		if (textRef) { textRef(node); }

		if (node) {
			fixMarkup(node);
		}
	}


	render () {
		const {text, ...otherProps} = this.props;

		delete otherProps.textRef;

		return (
			<Base {...otherProps} ref={this.attachRef} {...rawContent(text)} />
		);
	}
}
