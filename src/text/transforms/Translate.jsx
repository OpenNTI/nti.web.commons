import React from 'react';
import PropTypes from 'prop-types';

const PrimitivesTypes = {
	string: true,
	number: true,
};

function getTranslatedContent(localeKey, getString, data) {
	const { translateData, parts } = Object.entries(data ?? {}).reduce(
		(acc, entry) => {
			const [key, value] = entry;
			const type = typeof value;

			if (PrimitivesTypes[type]) {
				acc.translateData[key] = value;
			} else {
				acc.translateData[key] = `***${key}***`;
				acc.parts[key] = value;
			}

			return acc;
		},
		{ translateData: {}, parts: {} }
	);

	const translation = getString(localeKey, translateData);
	const translationParts = translation.split('***');

	if (translationParts.length === 1) {
		return { text: translation, hasMarkup: true };
	}

	const text = (
		<>
			{translationParts.map((part, index) => {
				if (index % 2 === 0) {
					return <span key={index}>{part}</span>;
				}

				const cmp = parts[part];

				return React.cloneElement(cmp, { key: index });
			})}
		</>
	);

	return {
		hasComponents: true,
		text,
	};
}

const Translate = React.forwardRef(
	({ localeKey, getString, with: data, children, ...otherProps }, ref) => {
		const Text = React.Children.only(children);
		const content = getTranslatedContent(localeKey, getString, data);

		return React.cloneElement(Text, {
			...otherProps,
			...content,
			ref,
		});
	}
);

Translate.displayName = 'Translate';
Translate.shouldApply = ({ getString, localeKey }) =>
	getString != null && localeKey != null;
Translate.propTypes = {
	localeKey: PropTypes.string,
	getString: PropTypes.func,
	with: PropTypes.oneOfType([PropTypes.oneOf([false]), PropTypes.object]),
	textRef: PropTypes.any,
	children: PropTypes.any,
};

export default Translate;
