import './Card.scss';
import Url from 'url';

import React, { useEffect, useState } from 'react';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import { isNTIID } from '@nti/lib-ntiids';

import { SeparatedInline } from './list';
import AssetIcon from './AssetIcon';

/** @typedef {import('@nti/lib-interfaces').Models.content.Package} ContentPackage */

const t = scoped('common.units', {
	comments: {
		one: '%(count)s Comment',
		other: '%(count)s Comments',
	},
	by: 'By %(by)s',
});

const Seen = Symbol('Seen');

const isExternal = item => /external/i.test(item.type) || !isNTIID(item.href);

/*
Internal Links:
			NTIID: "tag:nextthought.com,2011-10:OU-RelatedWorkRef...:digestion_and_metabolism_textbook1"
		creator: "Openstax, Heather Ketchum, and Eric Bright"
			desc: "Read this material about Digestion and Metabolism."
			icon: "resources/.../fd35e23767020999111e1f49239199b4c5eff23e.png"
			label: "Digestion and Metabolism Textbook Reading 1"
			href: "tag:nextthought.com,2011-10:OU-HTML-...:digestion_and_metabolism_textbook1"
	target-NTIID: "tag:nextthought.com,2011-10:OU-HTML-...:digestion_and_metabolism_textbook1"
	targetMimeType: "application/vnd.nextthought.content"


External Links:
			NTIID: "tag:nextthought.com,2011-10:OU-RelatedWorkRef-...:library_guide_ou.2"
		creator: "University of Oklahoma Libraries"
			desc: "This guide is designed to provide additional resources to help you study."
			icon: "resources/.../fd35e23767020999111e1f49239199b4c5eff23e.png"
			label: "Library Guide for Human Physiology"
			href: "http://guides.ou.edu/biol2124_humanphysiology"
	target-NTIID: "tag:nextthought.com,2011-10:NTI-UUID-dbbb93c8d79d8de6e1edcbe8685c07c9"
	targetMimeType: "application/vnd.nextthought.externallink"

*/

/**
 * @typedef {object} Ref
 * @property {string} NTIID
 * @property {string?} creator
 * @property {string} desc
 * @property {string} icon
 * @property {string?} label preferred and will take precedence over title
 * @property {string?} title
 * @property {string?} target-NTIID
 * @property {string?} targetMimeType
 */

/**
 *
 * @param {object} props
 * @param {ContentPackage} props.contentPackage The owning contentPackage to provide a method "resolveContentURL"
 * @param {boolean} [props.internalOverride=false] Allow the parent to force this card to be an "internal" link.
 * @param {Ref} props.item The object with with all the metadata.
 * @param {(e: Event) => void} props.onClick
 * @param {boolean=} props.seen
 * @param {boolean=} props.noProgress
 * @param {React.ReactNode=} props.labels Items to render as the labels of the card (i.e Comment count)
 * @returns {JSX.Element}
 */
export default function RelatedWorkRefCard({
	internalOverride = false,
	contentPackage,
	item,
	onClick,
	seen,
	noProgress,
	labels,
	...remainder
}) {
	const [icon, setIcon] = useState();
	const isSeen = noProgress
		? false
		: seen || item?.[Seen] || item?.hasCompleted?.();
	const type = [item?.type || item?.MimeType, item?.targetMimeType]
		.filter(x => x)
		.reduce((a, b) => a.concat(b), []);

	useEffect(() => {
		setIcon(null);
		let late = false;

		(async () => {
			const icon = await RelatedWorkRefCard.resolveIcon(
				item,
				contentPackage
			);

			if (!late) {
				setIcon(icon);
			}
		})();

		return () => {
			late = true;
		};
	}, [item]);

	const external = isExternal(item) && !internalOverride;

	const { label, title, desc, description, byline, creator } = item;

	const by = 'byline' in item ? byline : creator;

	const props = {
		...remainder,
		className: cx('content-link', 'related-work-ref', {
			external,
			seen: isSeen,
		}),
		target: external ? '_blank' : null,
		onClick: this.onClick,
		ref: this.attachRef,
	};

	return (
		<div {...props}>
			<AssetIcon src={icon} mimeType={type} href={item?.href}>
				{external && <div className="external" />}
			</AssetIcon>

			<h5>{label || title}</h5>
			{by && by.trim().length > 0 && (
				<div className="label">{t('by', { by: by })}</div>
			)}
			{React.isValidElement(description) ? (
				typeof description.type !== 'string' ? (
					description
				) : (
					React.cloneElement(description, {
						className: cx(
							'description',
							description.props?.className
						),
					})
				)
			) : (
				<div className="description">{description || desc}</div>
			)}
			{labels && (
				<SeparatedInline className="extra-labels">
					{labels}
				</SeparatedInline>
			)}
		</div>
	);
}

RelatedWorkRefCard.isExternal = ({ item, internalOverride } = {}) => {
	return isExternal(item) && !internalOverride;
};

RelatedWorkRefCard.resolveIcon = async (item, contentPackage) => {
	let icon = item?.icon ?? '';

	try {
		const u = icon && Url.parse(icon);
		if (!u || (!u.host && u.path[0] !== '/')) {
			icon = item?.resolveIcon
				? await item?.resolveIcon(contentPackage)
				: item?.icon;

			icon =
				(icon && (await contentPackage.resolveContentURL(icon))) ||
				null;
		}
	} catch (e) {
		icon = null;
	}

	return icon;
};
