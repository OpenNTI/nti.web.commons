import React from 'react';

import FontIcon from './types/Font-Icon';
import SVGIcon from './types/SVG-Icon';

const icon = 'icon-check';

export function Check(props) {
	return <FontIcon icon={icon} {...props} />;
}

Check.Circled = props => (
	<SVGIcon width="24" height="24" {...props} viewBox="0 0 24 24">
		<g fill="currentColor" fillRule="evenodd">
			<path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-1.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17z" />
			<path d="m8 13.318.994-1.699 2.468 1.884L14.476 8 16 8.9 11.974 16z" />
		</g>
	</SVGIcon>
);
