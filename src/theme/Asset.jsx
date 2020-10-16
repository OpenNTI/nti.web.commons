import React from 'react';
import PropTypes from 'prop-types';

import Image from '../image';

import {useThemeProperty} from './Hook';

ThemeAsset.propTypes = {
	property: PropTypes.object,
	name: PropTypes.string,
	style: PropTypes.object,
	cacheBust: PropTypes.bool
};
export default function ThemeAsset ({name, property, style, cacheBust, ...otherProps}) {
	const asset = property ? property : useThemeProperty(name);

	if (!asset || !asset.href) { return null; }

	const fillStyle = {...(style || {})};
	const {href, cacheBustHREF: cbHref} = asset;

	const src = cacheBust && cbHref ? cbHref : href;

	if (asset.fill) {
		fillStyle.backgroundColor = asset.fill;
	}

	return (
		<Image
			{...otherProps}
			src={src}
			srcset={Image.srcset.forSingleSourceDPI(src)}
			alt={asset.alt}
			fallback={asset.fallback}
			style={fillStyle}
		/>
	);
}
