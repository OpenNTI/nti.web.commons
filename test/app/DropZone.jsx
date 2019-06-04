import React from 'react';

import {DnD} from '../../src';

export default class DropZoneTest extends React.Component {
	render () {
		return (
			<DnD.DropZoneIndicator
				style={{height: '500px'}}
				accepts={DnD.DropZone.acceptFilesOfType('application/zip')}
				validDragOverClassName="valid"
				invalidDragOverClassName="invalid"
			>
				This is a drop zone
			</DnD.DropZoneIndicator>
		);
	}
}