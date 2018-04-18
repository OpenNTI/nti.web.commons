import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import {areYouSure} from '../prompts/';

const DEFAULT_TEXT = {
	unfollowPrompt: 'Remove this contact?',
};

let t = scoped('common.components.buttons.follow', DEFAULT_TEXT);


export default class extends React.Component {
	static displayName = 'FollowButton';

	static propTypes = {
		entity: PropTypes.object.isRequired
	};

	componentWillMount () {
		this.setFollowing();
	}

	componentWillReceiveProps (nextProps) {
		this.setFollowing(nextProps);
	}

	setFollowing = (props = this.props) => {
		let {entity} = props;
		this.setState({
			following: entity && entity.following
		});
	};

	toggleFollow = (e) => {
		e.preventDefault();
		e.stopPropagation();
		let {entity} = this.props;

		let p = this.state.following ? areYouSure(t('unfollowPrompt')) : Promise.resolve();
		p.then(() => {
			this.setState({
				loading: true
			});
			entity.follow()
				.then(() => {
					this.setState({
						following: entity.following,
						loading: false
					});
				});
		});
	};

	render () {
		let {following, loading} = this.state;
		let classes = cx({
			'follow-widget': true,
			'follow': !following,
			'unfollow': following,
			'loading': loading
		});
		return (
			<div className={classes} onClick={loading ? null : this.toggleFollow} />
		);
	}
}
