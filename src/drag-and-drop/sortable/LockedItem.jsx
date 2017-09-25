import React from 'react';

// just a marker for locked items
export default function LockedItem ({children}) {
	return (
		React.Children.only(children)
	);
}
