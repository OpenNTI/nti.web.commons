import React from 'react';

import SVGIcon from './types/SVG-Icon';

export function Person(props) {
	return (
		<SVGIcon
			{...props}
			width="0.875rem"
			height="1em"
			viewBox="0 0 14 16"
			stroke="currentColor"
		>
			<g
				stroke="none"
				strokeWidth="1"
				fill="none"
				fillRule="evenodd"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<g
					transform="translate(-120.000000, -268.000000)"
					stroke="currentColor"
					strokeWidth="2"
				>
					<g transform="translate(112.000000, 261.000000)">
						<g transform="translate(9.000000, 8.000000)">
							<path d="M12,14 L12,12.3333333 C12,10.4923842 10.6568542,9 9,9 L3,9 C1.34314575,9 0,10.4923842 0,12.3333333 L0,14"></path>
							<circle cx="6" cy="3" r="3"></circle>
						</g>
					</g>
				</g>
			</g>
		</SVGIcon>
	);
}
