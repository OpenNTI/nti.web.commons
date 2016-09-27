import React from 'react';
import cx from 'classnames';

import {resolve, getDebugUsernameString} from 'nti-web-client/lib/user';

import {DataURIs} from '../constants';

const {BLANK_AVATAR, BLANK_GROUP_AVATAR} = DataURIs;

const DEFAULT = { entity: {avatarURL: BLANK_AVATAR }};
const DEFAULT_GROUP = { entity: {avatarURL: BLANK_GROUP_AVATAR }};


export default class Avatar extends React.Component {

	static propTypes = {
		entity: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.string
		]),

		className: React.PropTypes.string
	}


	constructor (props) {
		super(props);
		this.state = {};
	}


	componentDidMount () {
		this.fillIn();
	}


	componentWillReceiveProps (nextProps) {
		if (this.props.entity !== nextProps.entity) {
			this.fillIn(nextProps);
		}
	}


	fillIn (props = this.props) {

		this.setState({loading: true});

		resolve(props)
			.catch(() => DEFAULT)
			.then(x => this.setState({
				entity: x,
				color: this.getColorClass(x),
				loading: false
			}));
	}


	getColorClass (entity) {

		function hash (str) {
			let h = 0, c;
			if (str.length === 0) {
				return h;
			}

			for (let i = 0; i < str.length; i++) {
				c = str.charCodeAt(i);
				/*eslint-disable no-bitwise */
				h = ((h << 5) - h) + c;
				h = h & h; // Convert to 32bit integer
				/*eslint-enable no-bitwise */
			}
			return h;
		}

		const NUM_COLORS = 12;

		let hashedString = (typeof entity === 'string'
								? entity
								: (entity || {}).Username) || 'unknown';

		let idx = Math.abs(hash(hashedString)) % NUM_COLORS;

		return `avatar-color-${idx}`;
	}


	isGroup () {
		return /\..*(friendslist|community)/i.test((this.state.entity || {}).MimeType);
	}


	setUnknown () {
		if (!this.mounted) {
			return;
		}
		this.setState(this.isGroup() ? DEFAULT_GROUP : DEFAULT);
	}


	fallback () {
		return this.isGroup() ? BLANK_GROUP_AVATAR : BLANK_AVATAR;
	}


	render () {
		const {loading, entity, color} = this.state;
		const {className} = this.props;

		if (loading) { return null; }

		const {avatarURL, initials, displayName} = entity || {};

		const childProps = {
			...this.props,
			'data-for': getDebugUsernameString(entity),
			alt: 'Avatar for ' + displayName,
			className: cx('avatar', color, className)
		};

		delete childProps.entity;

		return avatarURL ? (
				<img {...childProps} src={avatarURL} onError={this.setUnknown}/>
			) : initials ? (
				<svg {...childProps} viewBox="0 0 32 32">
					<text textAnchor="middle" x="16px" y="21px">{initials}</text>
				</svg>
			) : (
				<img {...childProps} src={this.fallback()}/>
			);
	}
}
