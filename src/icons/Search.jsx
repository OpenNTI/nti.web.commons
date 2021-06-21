import React from 'react';

import SVGIcon from './types/SVG-Icon';

export function Search(props) {
	return (
		<SVGIcon width="17" height="17" {...props} viewBox="0 0 17 17">
			<g
				transform="translate(1 1)"
				stroke="currentColor"
				strokeWidth="2"
				fill="none"
				fillRule="evenodd"
			>
				<circle cx="5.5" cy="5.5" r="5.5" />
				<path d="M9.029 9.02l5.486 5.509" />
			</g>
		</SVGIcon>
	);
}
