import Url from 'url';

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {rawContent} from 'nti-commons';
import {Progress} from 'nti-lib-interfaces';
import {scoped} from 'nti-lib-locale';
import {isNTIID} from 'nti-lib-ntiids';

import {DataURIs} from '../constants';

import {SeparatedInline} from './list';
import AssetIcon from './AssetIcon';

const {BLANK_IMAGE} = DataURIs;


const t = scoped('common.units', {
	comments: {
		one: '%(count)s Comment',
		other: '%(count)s Comments'
	},
	by: 'By %(by)s'
});

const Seen = Symbol('Seen');

const isExternal = (item) => /external/i.test(item.type) || !isNTIID(item.href);


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


export default class RelatedWorkRefCard extends React.Component {
	static async resolveIcon (item = {}, contentPackage) {
		let {icon = ''} = item;

		try {
			const u = icon && Url.parse(icon);
			if (!u || (!u.host && u.path[0] !== '/')) {
				icon = item.resolveIcon
					? await item.resolveIcon(contentPackage)
					: item.icon;

				icon = (icon && await contentPackage.resolveContentURL(icon)) || null;
			}
		} catch (e) {
			icon = null;
		}

		return icon;
	}


	static propTypes = {
		/**
		 * The owning contentPackage to provide a method "resolveContentURL"
		 * @type {Package}
		 */
		contentPackage: PropTypes.object,

		/**
		 * The object with with all the metadata. Should have properties:
		 *
		 * 	- NTIID
		 * 	- desc
		 * 	- icon
		 * 	- title
		 * 	- label
		 *
		 * @type {object}
		 */
		item: PropTypes.object.isRequired,

		/**
		 * Allow the parent to force this card to be an "internal" link.
		 * @type {boolean}
		 */
		internalOverride: PropTypes.bool,


		onClick: PropTypes.func,
		icon: PropTypes.string,
		seen: PropTypes.bool,

		/**
		 * Items to render as the labels of the card (i.e Comment count)
		 * @type {object}
		 */
		labels: PropTypes.array,

	}


	static defaultProps = {
		internalOverride: false
	}

	static isExternal = isExternal

	state = {
		icon: null
	}


	isExternal (props = this.props) {
		const {item, internalOverride} = props || {};
		return isExternal(item) && !internalOverride;
	}


	componentDidMount () {
		this.shouldHaveDOM = true;
		this.resolveIcon(this.props);
	}


	componentWillUnmount () {
		this.setState = () => {};
	}


	componentWillReceiveProps (props) {
		const {item} = this.props;
		if(item !== props.item) {
			this.setState({
				icon: null,
				iconResolved: false,
				href: null
			});
			this.resolveIcon(props);
		}
	}


	async resolveIcon (props) {
		const {contentPackage, item = {}} = props;

		const icon = await RelatedWorkRefCard.resolveIcon(item, contentPackage);

		this.setState({iconResolved: true, icon});
	}


	isSeen () {
		const {item, seen} = this.props;
		const progress = item[Progress];
		return seen || item[Seen] || (progress && progress.hasProgress());
	}


	getType () {
		const {item} = this.props;
		return [item.type, item.targetMimeType]
			.filter(x => x)
			.reduce((a, b) => a.concat(b), []);
	}


	render () {
		const {
			state: {
				href,
				icon
			},
			props: {
				item,
				labels,
				...remainder
			}
		} = this;

		const external = this.isExternal();
		const seen = this.isSeen();

		const iconSrc = (seen && !icon) ? BLANK_IMAGE : icon;

		const {label, title, desc, description, byline, creator} = item;

		const by = 'byline' in item ? byline : creator;

		for (let key of Object.keys(RelatedWorkRefCard.propTypes)) {
			delete remainder[key];
		}

		const props = {
			...remainder,
			className: cx('content-link', 'related-work-ref', {external, seen}),
			target: external ? '_blank' : null,
			onClick: this.onClick,
			ref: this.attachRef
		};


		return (
			<div {...props}>

				<AssetIcon src={iconSrc} mimeType={this.getType()} href={href}>
					{external && <div className="external"/>}
				</AssetIcon>

				<h5 {...rawContent(label || title)}/>
				{by && by.trim().length > 0 && (
					<div className="label" {...rawContent(t('by', {by: by}))}/>
				)}
				<div className="description" {...rawContent(description || desc)}/>
				{labels && (
					<SeparatedInline className="extra-labels">
						{labels}
					</SeparatedInline>
				)}
			</div>
		);
	}
}
