import React from 'react';
import PropTypes from 'prop-types';

import Image from '../image';

import {useThemeProperty} from './Hook';

ThemeAsset.propTypes = {
	property: PropTypes.object,
	name: PropTypes.string
};
export default function ThemeAsset ({name, property, ...otherProps}) {
	const asset = property ? property : useThemeProperty(name);

	if (!asset) { return null; }

	const style = {};

	if (asset.fill) {
		style.backgroundColor = asset.fill;
	}

	return (
		<Image
			{...otherProps}
			src={asset.href}
			srcset={Image.srcset.forSingleSourceDPI(asset.href)}
			alt={asset.alt}
			fallback={asset.fallback}
			style={style}
		/>
	);
}