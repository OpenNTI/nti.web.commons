import './Notification.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { MountToBody } from '../../remote-mount';

export default class UpdateNotice extends React.Component {
	static propTypes = {
		lastUpdated: PropTypes.number,
	};

	state = {
		hidden: false,
	};

	componentDidUpdate({ lastUpdated }) {
		if (this.state.hidden && lastUpdated !== this.props.lastUpdated) {
			this.setState({ hidden: false });
		}
	}

	handleClick = () => {
		const { location } = window;

		location.reload(true);
	};

	handleHide = () => {
		this.setState({ hidden: true });
	};

	render() {
		const { hidden } = this.state;
		return (
			<MountToBody>
				<h4
					className={cx('application-update-notification', {
						dismissed: hidden,
					})}
				>
					<i className="icon-bold-x" onClick={this.handleHide} />
					There is a new version available.{' '}
					<a href="#" onClick={this.handleClick}>
						Reload
					</a>{' '}
					at your earliest convenience...
				</h4>
			</MountToBody>
		);
	}
}
