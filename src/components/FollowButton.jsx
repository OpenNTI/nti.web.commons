import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {User} from '@nti/web-client';
import {scoped} from '@nti/lib-locale';

import {ItemChanges} from '../HighOrderComponents';
import {areYouSure} from '../prompts/';

import PromiseButton from './PromiseButton';

const DEFAULT_TEXT = {
	unfollowPrompt: 'Remove this contact?',
};

let t = scoped('common.components.buttons.follow', DEFAULT_TEXT);


export default
@ItemChanges
class FollowButton extends React.Component {

	static propTypes = {
		entity: PropTypes.any.isRequired,
		children: PropTypes.node
	}

	componentDidMount () { this.setup(); }

	componentDidUpdate (prevProps) {
		if (this.props.entity !== prevProps.entity) {
			this.setup(prevProps);
		}
	}

	getItem (_, state) {
		return (state || {}).entity;
	}


	setup (props = this.props) {
		const {entity} = props;
		//so far, entity is always the full object, but allow it to be a string...
		User.resolve({entity})
			.then(e => this.setState({entity: e}));
	}


	toggleFollow = async () => {
		const {state: {entity}} = this;

		const {following} = entity;

		try {
			if (following) {
				await areYouSure(t('unfollowPrompt'));
			}

			await entity.follow();
		}
		catch (er) {
			//don't care
		}
	}


	render () {
		//Get the entity on the state, not the props. See @setup() above.
		const {entity} = this.state || {};
		const {children} = this.props;
		const child = React.Children.count(children) > 0
			? React.Children.only(children)
			: null;

		if (!entity) {
			return null;
		}

		const {following} = entity;

		const css = cx({
			'follow-button': !following,
			'unfollow-button': following
		});

		const text = child
			? React.cloneElement(child, {following})
			: following ? 'Unfollow' : 'Follow';

		return (
			<PromiseButton className={css} onClick={this.toggleFollow}>
				{text}
			</PromiseButton>
		);
	}
}
