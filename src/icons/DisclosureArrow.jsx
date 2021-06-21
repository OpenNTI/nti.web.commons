import React from 'react';

import SVGIcon from './types/SVG-Icon';

export const DisclosureArrow = React.forwardRef(function DisclosureArrow(
	props,
	ref
) {
	return (
		<SVGIcon width="12" height="5" viewBox="0 0 12 5" {...props} ref={ref}>
			<polygon points="11.5,0 6,5 0.5,0 " />
		</SVGIcon>
	);
});
