import React from 'react';

import RemoteMountPoint from './RemoteMountPoint';

function getBody () {
	return document.body;
}


export default function MountToBody (props) {
	const body = getBody();

	return (
		<RemoteMountPoint
			{...props}
			appendTo={body}
		/>
	);
}
