import React from 'react';
import {MountToBody} from '../../../remote-mount';

export default class ControlBarView extends React.Component {
	static propTypes = {
		visible: React.PropTypes.bool,
		children: React.PropTypes.node
	}

	render () {
		return (
			<MountToBody className="nti-control-bar-mount">
				<span>Control Bar</span>
			</MountToBody>
		);
	}
}
