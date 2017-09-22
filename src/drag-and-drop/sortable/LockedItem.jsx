import React from 'react';

export default function LockedItem ({children}) {
	return (
		React.Children.only(children)
	);
}
