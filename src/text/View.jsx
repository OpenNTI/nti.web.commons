import React from 'react';
import PropTypes from 'prop-types';

import {Ellipsis} from './Constants';
import {getTextFromChildren} from './utils';
import {getRenderer} from './renderers';
import {getTransforms} from './transforms';

function cleanProps (props) {
	const clean = {...props};

	delete clean.limitLines;
	delete clean.overflow;

	return clean;
}

NTIText.Ellipsis = Ellipsis;
NTIText.propTypes = {
	children: PropTypes.any
};
export default function NTIText ({children, ...props}) {
	const text = getTextFromChildren(children);
	const Renderer = getRenderer(props);
	const transforms = getTransforms(props).reverse();

	let cmp = (<Renderer {...cleanProps(props)} />);

	for (let Transform of transforms) {
		cmp = (
			<Transform {...props} text={text}>
				{cmp}
			</Transform>
		);
	}

	return cmp;
}