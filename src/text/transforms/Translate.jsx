import React from 'react';
import PropTypes from 'prop-types';

import {ForwardRef} from '../../decorators';

const PrimativesTypes = {
	'string': true,
	'number': true
};

function getTranslatedContent (localeKey, getString, data) {
	const {translateData, parts} = Object.entries(data ?? {})
		.reduce((acc, entry) => {
			const [key, value] = entry;
			const type = typeof value;

			if (PrimativesTypes[type]) {
				acc.translateData[key] = value;
			} else {
				acc.translateData[key] = `***${key}***`;
				acc.parts[key] = value;
			}

			return acc;
		}, {translateData: {}, parts: {}});

	const translation = getString(localeKey, translateData);
	const translationParts = translation.split('***');

	if (translationParts.length === 1) { return {text: translation, hasMarkup: true}; }

	return {
		hasComponents: true,
		text: translationParts.map((part, index) => index % 2 === 0 ? part : parts[part])
	};
}

Translate.shouldApply = ({getString, localeKey}) => (getString != null && localeKey != null);
Translate.propTypes = {
	localeKey: PropTypes.string,
	getString: PropTypes.func,
	with: PropTypes.object,
	textRef: PropTypes.any,
	children: PropTypes.any
};
function Translate ({localeKey, getString, with:data, textRef, children, ...otherProps}) {
	const Text = React.Children.only(children);
	const content = getTranslatedContent(localeKey, getString, data);

	return React.cloneElement(
		Text,
		{
			...otherProps,
			...content,
			ref: textRef
		}
	);
}

export default ForwardRef('textRef')(Translate);
