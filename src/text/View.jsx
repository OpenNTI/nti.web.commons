import React from 'react';
import PropTypes from 'prop-types';

import { Variant } from '../HighOrderComponents';

import variants, { Colors } from './variants';
import { getTextPropsFromChildren } from './utils';
import { getTransforms } from './transforms';
import Renderer from './Renderer';

const NTIText = React.forwardRef(
	(
		{
			children,
			dangerouslySetInnerHTML,
			as: tag,
			className,
			escaped,
			localized,
			...props
		},
		ref
	) => {
		const textProps = getTextPropsFromChildren(
			dangerouslySetInnerHTML?.__html || children,
			localized || escaped
		);
		const combinedProps = { ...props, ...textProps };

		if (dangerouslySetInnerHTML) {
			combinedProps.hasMarkup = true;
		}

		const transforms = getTransforms(combinedProps).reverse();

		let cmp = (
			<Renderer
				as={tag}
				className={className}
				{...combinedProps}
				ref={ref}
			/>
		);

		for (let Transform of transforms) {
			cmp = (
				<Transform {...combinedProps} className={className}>
					{cmp}
				</Transform>
			);
		}

		return cmp;
	}
);

NTIText.displayName = 'NTIText';

NTIText.Translator = getString => {
	const Translate = Variant(NTIText, { getString }, 'translator');

	Translate.Base = Variant(Translate, variants.Base, 'Base');
	Translate.Condensed = Variant(Translate, variants.Condensed, 'Condensed');
	Translate.Label = Variant(Translate, variants.Label, 'Label');

	return Translate;
};

NTIText.Classes = {
	Base: variants.Base.className,
	Condensed: variants.Condensed.className,
};

NTIText.Base = Variant(NTIText, variants.Base, 'Base');
NTIText.Condensed = Variant(NTIText, variants.Condensed, 'Condensed');
NTIText.Label = Variant(NTIText, variants.Label, 'Label');
NTIText.Colors = Colors;

NTIText.propTypes = {
	children: PropTypes.any,
	dangerouslySetInnerHTML: PropTypes.shape({ __html: PropTypes.string }),
	as: PropTypes.any,
	className: PropTypes.string,
	escaped: PropTypes.bool,
	localized: PropTypes.bool,
};

export default NTIText;
