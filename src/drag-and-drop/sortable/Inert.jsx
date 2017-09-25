import React from 'react';

// just a marker for inert items (items that don't
// interact with the sortable/drag-and-drop behavior)
export default function Inert ({children}) {
	return (
		React.Children.only(children)
	);
}
