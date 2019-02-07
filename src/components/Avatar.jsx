import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {User} from '@nti/web-client';

import {DataURIs} from '../constants';

import BaseEntity from './BaseEntity';
import Square from './SquareImg';

const {BLANK_AVATAR, BLANK_GROUP_AVATAR} = DataURIs;

const DEFAULT = { entity: {avatarURL: BLANK_AVATAR }};
const DEFAULT_GROUP = { entity: {avatarURL: BLANK_GROUP_AVATAR }};

export default class Avatar extends BaseEntity {

	static propTypes = {
		...BaseEntity.propTypes,

		entity: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.string
		]),

		className: PropTypes.string
	}


	static getColorClass (entity) {

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


	setUnknown = () => {
		if (this.unmounted) {
			return;
		}

		this.setState(this.isGroup() ? DEFAULT_GROUP : DEFAULT);
	}


	fallback () {
		return this.isGroup() ? BLANK_GROUP_AVATAR : BLANK_AVATAR;
	}


	render () {
		const {entity} = this.state;
		const {className, ...props} = this.props;

		if (!entity) { return null; }

		const color = Avatar.getColorClass(entity);
		const {avatarURL, initials, displayName} = entity || {};

		delete props.entity;
		delete props.entityId;

		const childProps = {
			...props,
			'data-for': User.getDebugUsernameString(entity),
			alt: 'Avatar for ' + displayName,
			className: cx('avatar', color, className)
		};

		return avatarURL ? (
			<Square {...childProps} src={avatarURL} onError={this.setUnknown} />
		) : initials ? (
			<svg {...childProps} viewBox="0 0 32 32">
				<text textAnchor="middle" x="16px" y="21px">{initials}</text>
			</svg>
		) : (
			<Square {...childProps} src={this.fallback()}/>
		);
	}
}
