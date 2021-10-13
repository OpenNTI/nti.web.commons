import PropTypes from 'prop-types';
import cx from 'classnames';

import t, { scoped } from '@nti/lib-locale';
import { getAppUsername } from '@nti/web-client';

import { filterProps } from '../utils/filter-props.js';

import BaseEntity from './BaseEntity';

const strings = scoped('web-commons.components.DisplayName', {
	deactivated: '%(name)s(Inactive)',
});

/**
 * This DisplayName component can use the full Entity instance if you have it.
 * Otherwise, it will take a username string for the entity prop. If you do not
 * have the full entity object, and you want to show the display name, do not
 * resolve the full entity object yourself just to pass to this component.
 * Only resolve the entity IF and ONLY IF you need it for something else. Most
 * likely, if its a link, or something, use the corresponding Component,
 * do not roll your own.
 */

export default function DisplayName(props) {
	return <BaseEntity {...props}>{DisplayNameContent}</BaseEntity>;
}

DisplayName.propTypes = {
	...BaseEntity.propTypes,

	localeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

	as: PropTypes.any,

	/** @deprecated use 'as' */
	tag: PropTypes.any,

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

	/**
	 * Specify a substring to mark
	 *
	 * @type {string}
	 */
	mark: PropTypes.string,
};

DisplayName.from = from;

function DisplayNameContent({
	as,
	entity,
	className,
	localeKey,
	tag = as,
	usePronoun,
	useGeneralName,
	mark,
	...otherProps
}) {
	const Tag = tag || (localeKey ? 'address' : 'span');

	let name = from(entity);

	if (mark && name) {
		name = name.replace(
			new RegExp(mark, 'gi'),
			match => `<mark>${match}</mark>`
		);
	}

	const props = {
		...otherProps,
		className: cx('username', className),
		children: name,
	};

	delete props.entity;
	delete props.entityId;

	if (localeKey) {
		const innerTag = Tag === 'a' ? 'span' : 'a';
		name = `<${innerTag} rel="author" class="username">${name}</${innerTag}>`;

		const getString =
			typeof localeKey === 'function' ? localeKey : o => t(localeKey, o);

		name = getString({ name });
	}

	// any markup
	if (/[<>]/.test(name)) {
		Object.assign(props, {
			children: void 0,
			dangerouslySetInnerHTML: { __html: name },
		});
	}

	return <Tag {...filterProps(props, Tag)} rel="author" />;
}

/**
 *
 * @param {import('@nti/lib-interfaces').Models.entities.Entity} entity
 * @param {Object} options
 * @param {boolean} options.useGeneralName
 * @param {boolean} options.usePronoun
 * @returns {string}
 */
function from(entity, { usePronoun, useGeneralName } = {}) {
	const appUser = getAppUsername();
	const { generalName } = entity || {};
	const displayName =
		usePronoun && entity?.getID() === appUser
			? typeof usePronoun === 'string'
				? usePronoun
				: 'You'
			: entity?.displayName;

	let name = (useGeneralName && generalName) || displayName;

	if (entity?.Deactivated) {
		name = strings('deactivated', { name });
	}

	return name;
}
