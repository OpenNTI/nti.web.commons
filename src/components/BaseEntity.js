import React from 'react';
import PropTypes from 'prop-types';
import {User} from '@nti/web-client';
import {PropTypes as MorePropTypes} from '@nti/lib-commons';


/**
 * This component can use the full Entity instance if you have it.
 * Otherwise, it will take a username string for the entity prop.
 */
export default class BaseEntity extends React.Component {

	static propTypes = {
		entity: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.string
		]).isRequired,

		entityId: MorePropTypes.deprecated
	}

	state = {}

	componentDidMount () {
		this.fillIn();
	}


	componentDidUpdate (prevProps) {
		if (this.props.entity !== prevProps.entity) {
			this.fillIn();
		}
	}


	componentWillUnmount () {
		this.unmounted = true;
		this.setState = () => {};
	}

	getUsername (usernameSeed) {
		return 'Anonymous User';	// do we need to show identifying numbers after Anonymous User?
	}

	async fillIn (props = this.props) {
		const task = this.task = new Date();
		const set = x => (task === this.task) && this.setState(x);

		const getID = x => x && x.getID ? x.getID() : x;
		const current = getID(this.state.entity);

		try {
			if (current !== getID(props.entity)) {
				const entity = await User.resolve(props);
				set({entity});
			}
		} catch (e) {
			const unresolvedName = this.getUsername(props.entity.username || props.entity);

			set({
				error: e,
				entity: {
					displayName: unresolvedName,
					username: unresolvedName,
					getID: () => { '__unresolvedUser__';}
				}
			});
		}
	}
}
