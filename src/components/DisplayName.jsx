import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import t, { scoped } from '@nti/lib-locale';
import { getAppUsername, User } from '@nti/web-client';

import BaseEntity from './BaseEntity';

const strings = scoped('web-commons.components.DisplayName', {
	deactivated: '%(name)s(Inactive)',
});

/**
 * This DisplayName component can use the full Entity instance if you have it.
 * Otherwise, it will take a username string for the entity prop. If you do not
 * have the full entity object, and you want to show the display name, do not
 * resolve the full entity object yourself just to pass to this componenent.
 * Only resolve the entity IF and ONLY IF you need it for something else. Most
 * likely, if its a link, or something, use the corresponding Component,
 * do not roll your own.
 */
export default class DisplayName extends BaseEntity {
	static propTypes = {
		...BaseEntity.propTypes,

		className: PropTypes.string,

		localeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

		tag: PropTypes.any,

		entity: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
			.isRequired,

		/**
		 * Specifies to substitute your name with the specified string, or "You" if prop is boolean.
		 *
		 * @type {boolean|string}
		 */
		usePronoun: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),

		/**
		 * Sharing Scopes (entity objects) are given GeneralNames by the suggestion provider.
		 * This flag will instruct this component to use that designation instead of the displayName.
		 *
		 * @type {boolean}
		 */
		useGeneralName: PropTypes.bool,
	};

	render() {
		const appuser = getAppUsername();
		const {
			props: {
				className,
				localeKey,
				tag,
				usePronoun,
				useGeneralName,
				...otherProps
			},
			state: { entity },
		} = this;
		const Tag = tag || (localeKey ? 'address' : 'span');

		if (!entity) {
			return null;
		}

		const { generalName } = entity;
		const displayName =
			usePronoun && entity.getID() === appuser
				? typeof usePronoun === 'string'
					? usePronoun
					: 'You'
				: entity.displayName;

		let name = (useGeneralName && generalName) || displayName;

		if (entity.Deactivated) {
			name = strings('deactivated', { name });
		}

		const props = {
			...otherProps,
			className: cx('username', className),
			children: name,
			'data-for': User.getDebugUsernameString(entity),
		};

		delete props.entity;
		delete props.entityId;

		if (localeKey) {
			const innerTag = Tag === 'a' ? 'span' : 'a';
			name = `<${innerTag} rel="author" class="username">${name}</${innerTag}>`;

			const getString =
				typeof localeKey === 'function'
					? localeKey
					: o => t(localeKey, o);

			Object.assign(props, {
				children: void 0,
				dangerouslySetInnerHTML: { __html: getString({ name }) },
			});
		}

		return <Tag {...props} rel="author" />;
	}
}
