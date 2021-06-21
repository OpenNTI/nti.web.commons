import React from 'react';

import SVGIcon from './types/SVG-Icon';

export function Globe(props) {
	return (
		<SVGIcon {...props}>
			<g
				stroke="none"
				strokeWidth="1"
				fill="none"
				fillRule="evenodd"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<g
					transform="translate(-119.000000, -158.000000)"
					stroke="currentColor"
					strokeWidth="2"
				>
					<g transform="translate(112.000000, 151.000000)">
						<g transform="translate(8.000000, 8.000000)">
							<circle cx="7" cy="7" r="7"></circle>
							<path d="M0,7.5 L14,7.5"></path>
							<path d="M7,0 C8.87596028,1.91684703 9.94206457,4.4044237 10,7 C9.94206457,9.5955763 8.87596028,12.083153 7,14 C5.12403972,12.083153 4.05793543,9.5955763 4,7 C4.05793543,4.4044237 5.12403972,1.91684703 7,0 L7,0 Z"></path>
						</g>
					</g>
				</g>
			</g>
		</SVGIcon>
	);
}
