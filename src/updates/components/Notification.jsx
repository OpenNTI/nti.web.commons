import React from 'react';
// import PropTypes from 'prop-types';

import {MountToBody} from '../../remote-mount';

export default class UpdateNotice extends React.Component {

	handleClick = () => {
		const {location} = window;

		location.reload(true);
	}

	render () {
		return (
			<MountToBody>
				<h4 className="application-update-notification">
					There is a new version available. <a href="#" onClick={this.handleClick}>Reload</a> at your earliest convenience...
				</h4>
			</MountToBody>
		);
	}
}
