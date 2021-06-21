import React from 'react';

import { useId } from '../hooks/use-id';

import SVGIcon from './types/SVG-Icon';

export function VideoResume(props) {
	const maskId = useId('mask');
	const maskURL = `url(#${maskId})`;

	return (
		<SVGIcon {...props} viewBox="0 0 17 15" width="1.125em">
			<g fill="none" fillRule="evenodd">
				<path fill="currentColor" d="M12 7.5 7 10V5z" />
				<mask id={maskId} fill="currentColor">
					<path d="M17 0v12h-5v3H0V3h6V0h11z" />
				</mask>
				<rect
					stroke="currentColor"
					mask={maskURL}
					x=".5"
					y="1.5"
					width="16"
					height="12"
					rx="3"
				/>
				<path fill="currentColor" d="M6 0v3L3 1.5zm6 12v3l3-1.5z" />
			</g>
		</SVGIcon>
	);
}
