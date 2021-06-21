import React from 'react';

import SVGIcon from './types/SVG-Icon';
import FontIcon from './types/Font-Icon';

function BoldX(props) {
	return <FontIcon icon="icon-bold-x" {...props} />;
}

X.Bold = BoldX;
export function X(props) {
	return (
		<SVGIcon {...props}>
			<path
				fillRule="evenodd"
				d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"
			/>
			<path
				fillRule="evenodd"
				d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"
			/>
		</SVGIcon>
	);
}
