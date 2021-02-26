import React from 'react';
import PropTypes from 'prop-types';

import generator from './generator';
import { Base } from './Base';

const TextInner = styled('span')`
	display: inline-block;
	position: relative;
	color: rgba(0, 0, 0, 0);

	&.full {
		display: block;
	}
`;

const Placeholder = styled(Base)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;

TextPlaceholder.propTypes = {
	text: PropTypes.string,
	flat: PropTypes.bool
};
function TextPlaceholder ({text, flat, ...otherProps}) {
	return (
		<TextInner {...otherProps} full={!text}>
			<span ariaHidden>{text || 'w'}</span>
			<Placeholder flat={flat} />
		</TextInner>
	)
}

export const Text = generator(TextPlaceholder);
