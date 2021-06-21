import React from 'react';

import SVGIcon from './types/SVG-Icon';

export function Image(props) {
	return (
		<SVGIcon viewBox="0 0 20 20" width="1.25em">
			<g
				stroke="none"
				strokeWidth="1"
				fill="none"
				fillRule="evenodd"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<g
					transform="translate(-395.000000, -423.000000)"
					stroke="currentColor"
					strokeWidth="2"
				>
					<g transform="translate(396.000000, 421.000000)">
						<g transform="translate(0.000000, 3.000000)">
							<rect
								fill="#ffffff"
								x="0"
								y="0"
								width="18"
								height="18"
								rx="2"
							></rect>
							<circle cx="5.5" cy="5.5" r="1.5"></circle>
							<polyline points="18 12 13 7 2 18"></polyline>
						</g>
					</g>
				</g>
			</g>
		</SVGIcon>
	);
}
