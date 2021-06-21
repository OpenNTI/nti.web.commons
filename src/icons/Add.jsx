import React from 'react';

import FontIcon from './types/Font-Icon';
import SVGIcon from './types/SVG-Icon';

Add.Circled = props => {
	return (
		<SVGIcon width="26" height="26" {...props} viewBox="0 0 26 26">
			<g transform="translate(1 1)" fill="none" fillRule="evenodd">
				<circle stroke="currentColor" cx="12" cy="12" r="12" />
				<path
					d="M13 5v6h6v2h-6v6h-2v-6H5v-2h6V5h2z"
					fill="currentColor"
				/>
			</g>
		</SVGIcon>
	);
};

Add.Circled.displayName = 'AddCircled';

export function Add(props) {
	return <FontIcon icon="icon-add" {...props} />;
}
