import React from 'react';

export default function useForceUpdate () {
	const[, setLastUpdate] = React.useState();

	return () => setLastUpdate(Date.now());
}