import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { User } from '@nti/web-client';

import { DataURIs } from '../constants';
import { filterProps } from '../utils';
import { useSharedDOM } from '../hooks/use-shared-dom.js';

import BaseEntity from './BaseEntity';
import Square from './SquareImg';
import styles from './Avatar.css';

const { BLANK_AVATAR, BLANK_GROUP_AVATAR } = DataURIs;

const DEFAULT = { entity: { avatarURL: BLANK_AVATAR } };
const DEFAULT_GROUP = { entity: { avatarURL: BLANK_GROUP_AVATAR } };

const MASK_SPEC = `
<svg style="position:absolute;width:0;height:0">
	<defs>
		<mask id="presence-mask" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
			<circle cx=".50" cy=".50" r=".50" fill="white" />
			<circle cx=".867" cy="0.865" r=".135" fill="black"/>
		</mask>
	</defs>
</svg>
`;

export default class Avatar extends BaseEntity {
	static propTypes = {
		...BaseEntity.propTypes,

		entity: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

		className: PropTypes.string,

		// fill for non-square avatars; 'none', 'src' or a canvas fillStyle compatible value.
		letterbox: PropTypes.string,

		as: PropTypes.any,

		presence: PropTypes.any,
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
		return /\..*(friendsList|community)/i.test(
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
			presence,
			letterbox = 'black',
			...props
		} = this.props;

		if (!entity) {
			return null;
		}

		const color = Avatar.getColorClass(entity);
		const { initials, displayName } = entity || {};

		const imgSrc = (entity.Deactivated ? DEFAULT.entity : entity).avatarURL;

		const renderer = imgSrc || !initials ? Component : 'svg';

		const childProps = {
			...filterProps(props, renderer),
			letterbox,
			'data-for': User.getDebugUsernameString(entity),
			alt: displayName && 'Avatar for ' + displayName,
			className: cx(styles.avatar, 'avatar', color, className, {
				[styles.withPresence]: presence,
			}),
		};

		return (
			<>
				{imgSrc ? (
					<Component
						{...childProps}
						src={imgSrc}
						onError={this.setUnknown}
					/>
				) : initials ? (
					<svg viewBox="0 0 32 32" {...childProps}>
						<rect width="100%" height="100%" />
						<text
							dominantBaseline="central"
							textAnchor="middle"
							x="50%"
							y="50%"
						>
							{initials}
						</text>
					</svg>
				) : (
					<Component {...childProps} src={this.fallback()} />
				)}
				{presence && <AvatarMask />}
			</>
		);
	}
}

function AvatarMask() {
	useSharedDOM(MASK_SPEC);
	return null;
}
