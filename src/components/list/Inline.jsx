import React from 'react';

import LimitedInline from './LimitedInline';

/**
 * Render a list inline
 *
 * @deprecated use LimitedInline instead
 * @param {Object} props children, and limit
 * @returns {ReactElement} a react component
 */
export default function Inline(props) {
	console.error('Inline has been moved to LimitedInline'); //eslint-disable-line

	return <LimitedInline {...props} />;
}
