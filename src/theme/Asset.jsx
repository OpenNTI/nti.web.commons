import React from 'react';
import PropTypes from 'prop-types';

import Image from '../image';

import {useThemeProperty} from './Hook';

ThemeAsset.propTypes = {
	property: PropTypes.object,
	name: PropTypes.string,
	style: PropTypes.object
};
export default function ThemeAsset ({name, property, style, ...otherProps}) {
	const asset = property ? property : useThemeProperty(name);

	if (!asset) { return null; }

	const fillStyle = {...(style || {})};

	if (asset.fill) {
		fillStyle.backgroundColor = asset.fill;
	}

	return (
		<Image
			{...otherProps}
			src={asset.href}
			srcset={Image.srcset.forSingleSourceDPI(asset.href)}
			alt={asset.alt}
			fallback={asset.fallback}
			style={fillStyle}
		/>
	);
}