import React from 'react';

import SVGIcon from './types/SVG-Icon';

export function Lock(props) {
	return (
		<SVGIcon
			width="0.875em"
			height="1em"
			viewBox="0 0 14 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<g transform="translate(-120.000000, -213.000000)">
				<g
					style={{ mixBlendMode: 'luminosity' }}
					transform="translate(112.000000, 206.000000)"
				>
					<g transform="translate(9.000000, 8.000000)">
						<path d="M1.71428571,6 L10.2857143,6 C11.2324881,6 12,6.79593822 12,7.77777778 L12,12.2222222 C12,13.2040618 11.2324881,14 10.2857143,14 L1.71428571,14 C0.767511857,14 0,13.2040618 0,12.2222222 L0,7.77777778 C0,6.79593822 0.767511857,6 1.71428571,6 Z"></path>
						<path d="M2,6 L2,3.33333333 C2,1.49238417 3.56700338,0 5.5,0 C7.43299662,0 9,1.49238417 9,3.33333333 L9,6"></path>
					</g>
				</g>
			</g>
		</SVGIcon>
	);
}
