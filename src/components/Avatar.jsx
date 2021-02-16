import './Avatar.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { User } from '@nti/web-client';

import { DataURIs } from '../constants';

import BaseEntity from './BaseEntity';
import Square from './SquareImg';

const { BLANK_AVATAR, BLANK_GROUP_AVATAR } = DataURIs;

const DEFAULT = { entity: { avatarURL: BLANK_AVATAR } };
const DEFAULT_GROUP = { entity: { avatarURL: BLANK_GROUP_AVATAR } };

export default class Avatar extends BaseEntity {
	static propTypes = {
		...BaseEntity.propTypes,

		entity: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

		className: PropTypes.string,

		// fill for non-square avatars; 'none', 'src' or a canvas fillStyle compatible value.
		letterbox: PropTypes.string,

		as: PropTypes.any,
	};

	static getColorClass(entity) {
		function hash(str) {
			let h = 0,
				c;
			if (str.length === 0) {
				return h;
			}

			for (let i = 0; i < str.length; i++) {
				c = str.charCodeAt(i);
				h = (h << 5) - h + c;
				h = h & h; // Convert to 32bit integer
			}
			return h;
		}

		const NUM_COLORS = 12;

		let hashedString =
			(typeof entity === 'string' ? entity : (entity || {}).Username) ||
			'unknown';

		let idx = Math.abs(hash(hashedString)) % NUM_COLORS;

		return `avatar-color-${idx}`;
	}

	isGroup() {
		return /\..*(friendslist|community)/i.test(
			(this.state.entity || {}).MimeType
		);
	}

	setUnknown = () => {
		if (this.unmounted) {
			return;
		}

		this.setState(this.isGroup() ? DEFAULT_GROUP : DEFAULT);
	};

	fallback() {
		return this.isGroup() ? BLANK_GROUP_AVATAR : BLANK_AVATAR;
	}

	render() {
		const { entity } = this.state;
		const {
			as: Component = Square,
			className,
			letterbox = 'black',
			...props
		} = this.props;

		if (!entity) {
			return null;
		}

		const color = Avatar.getColorClass(entity);
		const { initials, displayName } = entity || {};

		delete props.entity;
		delete props.entityId;
		delete props.me;

		const childProps = {
			...props,
			letterbox,
			'data-for': User.getDebugUsernameString(entity),
			alt: 'Avatar for ' + displayName,
			className: cx('avatar', color, className),
		};

		const imgSrc = (entity.Deactivated ? DEFAULT.entity : entity).avatarURL;

		return imgSrc ? (
			<Component {...childProps} src={imgSrc} onError={this.setUnknown} />
		) : initials ? (
			<svg {...childProps} viewBox="0 0 32 32">
				<rect width="100%" height="100%" />
				<text textAnchor="middle" x="16px" y="21px">
					{initials}
				</text>
			</svg>
		) : (
			<Component {...childProps} src={this.fallback()} />
		);
	}
}
