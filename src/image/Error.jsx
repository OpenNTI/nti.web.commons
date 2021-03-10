import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

import * as ErrorMessages from '../errors/messages';

const t = scoped('web-commons.image.Error', {
	message: 'Failed to load',
});

const SVG = styled('svg')`
	display: inline-block;
	background: var(--panel-background);
`;

const Message = styled('text')`
	font-size: 0.625rem;
	font-weight: 700;
	font-family: var(--body-font-family);
	fill: var(--primary-red);
	text-transform: uppercase;
`;

ImageError.propTypes = {
	error: PropTypes.any,
	style: PropTypes.object,
	aspectRatio: PropTypes.number,
};
export default function ImageError({
	error = t('message'),
	style,
	aspectRatio = 1,
	...props
}) {
	const width = 100;
	const height = width / aspectRatio;
	const viewbox = `0 0 ${width} ${height}`;

	return (
		<SVG
			viewBox={viewbox}
			width={width}
			height={height}
			preserveAspectRatio="xMinYMin slice"
			{...props}
		>
			<Message
				x="50%"
				y="50%"
				text-anchor="middle"
				dominant-baseline="middle"
			>
				{ErrorMessages.getMessage(error)}
			</Message>
		</SVG>
	);
}
