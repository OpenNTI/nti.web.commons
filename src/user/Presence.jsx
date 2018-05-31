import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Store from './PresenceStore';

export default class UserPresence extends React.Component {
	static Store = new Store();

	static propTypes = {
		className: PropTypes.string,
		user: PropTypes.object,
		children: PropTypes.element,
		border: PropTypes.bool,
		dark: PropTypes.bool
	}

	state = {}

	componentDidMount () {
		this.setupFor(this.props);
		this.addListener();
	}


	componentWillUnmount () {
		this.removeListener();
	}


	componentDidUpdate (prevProps) {
		const {user:oldUser} = prevProps;
		const {user:newUser} = this.props;

		if (oldUser !== newUser) {
			this.setupFor(this.props);
		}
	}


	setupFor (props) {
		const {user} = props;

		this.setState({
			presence: UserPresence.Store.getPresenceFor(user)
		});
	}


	addListener () {
		UserPresence.Store.addListener('presence-changed', this.onPresenceChanged);

		this.unsubcribe = () => {
			UserPresence.Store.removeListener('presence-changed', this.onPresenceChanged);
		};
	}


	removeListener () {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}


	onPresenceChanged = (username, presence) => {
		const {user} = this.props;

		if (user.getID() === username) {
			this.setState({
				presence
			});
		}
	}

	render () {
		const {children} = this.props;
		const {presence} = this.state;

		return children ?
			React.cloneElement(React.Children.only(children), {presence}) :
			this.renderDot(presence);
	}


	renderDot (presence) {
		const {className, border, dark, ...otherProps} = this.props;
		const name = presence ? presence.getName() : '';

		delete otherProps.user;

		return (
			<div
				className={
					cx(
						'nti-user-presence-dot',
						name,
						className,
						{border, dark}
					)
				}
				{...otherProps}

			/>
		);
	}
}
