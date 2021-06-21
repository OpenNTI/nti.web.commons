import React from 'react';

import SVGIcon from './types/SVG-Icon';

export function FileUpload(props) {
	return (
		<SVGIcon {...props} viewBox="0 0 18 22" width="1.125em">
			<g
				stroke="none"
				strokeWidth="1"
				fill="none"
				fillRule="evenodd"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<g
					transform="translate(-493.000000, -421.000000)"
					stroke="currentColor"
					strokeWidth="2"
				>
					<g transform="translate(396.000000, 421.000000)">
						<g transform="translate(98.000000, 1.000000)">
							<path
								d="M10,0 L2,0 C0.8954305,0 0,0.8954305 0,2 L0,18 C0,19.1045695 0.8954305,20 2,20 L14,20 C15.1045695,20 16,19.1045695 16,18 L16,6 L10,0 Z"
								fill="#FFFFFF"
							></path>
							<polyline points="10 0 10 6 16 6"></polyline>
							<path d="M8,16 L8,10"></path>
							<path d="M5,13 L11,13"></path>
						</g>
					</g>
				</g>
			</g>
		</SVGIcon>
	);
}
