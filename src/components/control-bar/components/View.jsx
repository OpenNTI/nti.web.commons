import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {MountToBody} from '../../../remote-mount';

ControlBarView.propTypes = {
	visible: React.PropTypes.bool,
	children: React.PropTypes.node
};

export default function ControlBarView ({visible, children}) {
	return (
		<MountToBody className="nti-control-bar-mount">
			<ReactCSSTransitionGroup transitionName="slideUp" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
				{visible && (
					<div key="control-bar" className="nti-control-bar">
						{children}
					</div>
				)}
			</ReactCSSTransitionGroup>
		</MountToBody>
	);
}
