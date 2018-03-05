import path from 'path';
import Url from 'url';

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {rawContent} from 'nti-commons';
import {Progress} from 'nti-lib-interfaces';
import {scoped} from 'nti-lib-locale';
import Logger from 'nti-util-logger';
import {isNTIID} from 'nti-lib-ntiids';

import {DataURIs} from '../constants';

import AssetIcon from './AssetIcon';

const {BLANK_IMAGE} = DataURIs;

const logger = Logger.get('common:components:card');

const t = scoped('common.units', {
	comments: {
		one: '%(count)s Comment',
		other: '%(count)s Comments'
	},
});

const Seen = Symbol('Seen');

const isExternal = (item) => /external/i.test(item.type) || !isNTIID(item.href);

function canSetState (cmp) {
	let can = false;

	try { can = !cmp.shouldHaveDOM || !!cmp.anchor; }
	catch (e) {} //eslint-disable-line

	return can;
}


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
	static propTypes = {
		/**
		 * Make the widget render without the link behavior.
		 *
		 * @type {boolean}
		 */
		disableLink: PropTypes.bool,

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

		/**
		 * HREF factory method for Object Ids.
		 * Givn an NTIID as the first argument, and an optional object as the second with named options.
		 *
		 * @type {function}
		 */
		getRoute: PropTypes.func,

		/**
		 * Allow the parent to have final word on the resolved url. (not called for OBJECT IDs)
		 * The function must take one argument, and return a string.
		 * @type {function}
		 */
		resolveUrlHook: PropTypes.func,


		onClick: PropTypes.func,


		icon: PropTypes.string,


		commentCount: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.string
		]),

		/**
		 * An array of ntiids
		 *
		 * @type {string[]}
		 */
		context: PropTypes.arrayOf(PropTypes.string)
	}

	static contextTypes = {
		analyticsManager: PropTypes.object.isRequired
	}

	static defaultProps = {
		internalOverride: false,
		resolveUrlHook: x => x
	}

	static isExternal = isExternal

	state = {
		icon: null
	}

	attachRef = (x) => this.anchor = x

	isExternal (props = this.props) {
		const {item, internalOverride} = props || {};
		return isExternal(item) && !internalOverride;
	}


	componentDidMount () {
		this.shouldHaveDOM = true;
		this.resolveIcon(this.props);
		this.resolveHref(this.props);
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
			this.resolveHref(props);
		}
	}


	getHref (ntiid, options) {
		return this.props.getRoute(ntiid, options);
	}


	async resolveHref (props) {
		const {resolveUrlHook, contentPackage, item} = props;
		const {href} = item;

		const setState = (...args) => {
			try {
				if (canSetState(this)) {
					this.setState(...args);
				}
			}
			catch (e) { logger.warn(e.message || e); }
		};

		if (isNTIID(href)) {
			setState({href: this.getHref(href)});
			return;
		}


		const u = href && Url.parse(href);

		if (u && (u.host || (u.path && u.path[0] === '/'))) {
			setState({href: resolveUrlHook(href)});
		}
		else if (contentPackage && href) {
			setState({ href: resolveUrlHook(await contentPackage.resolveContentURL(href)) });
		}
	}


	async resolveIcon (props) {
		const {contentPackage, item = {}} = props;

		let {icon = ''} = item;
		try {
			const u = Url.parse(icon);
			if (!u || (!u.host && u.path[0] !== '/')) {
				icon = item.resolveIcon
					? await item.resolveIcon(contentPackage)
					: item.icon;

				icon = (icon && await contentPackage.resolveContentURL(icon)) || null;
			}
		} catch (e) {
			icon = null;
		}

		if (canSetState(this)) {
			this.setState({iconResolved: true, icon});
		}
	}


	isSeen () {
		const {item} = this.props;
		const progress = item[Progress];
		return item[Seen] || (progress && progress.hasProgress());
	}


	onClick (e) {
		const {
			context: {
				analyticsManager
			},
			props: {
				context,
				item,
				onClick,
				disableLink
			}
		} = this;

		if (disableLink || (!this.state.href && this.isExternal())) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		if (this.ignoreClick) {
			delete this.ignoreClick;
			return;
		}


		if (onClick) {
			onClick(e);
		}

		if (!this.isSeen()) {
			item[Seen] = true;
		}

		if (analyticsManager && context && this.isExternal()) {
			const resourceId = item.NTIID || item.ntiid; //Cards built from DOM have lowercase.
			// const contentId = contentPackage.getID();//this can be a CourseInstance, ContentBundle, or ContentPackage
			analyticsManager.ExternalResourceView.send(resourceId, {context});
		}
	}


	onClickDiscussion (e) {
		const {anchor, props: {disableLink, item}} = this;

		if (disableLink) { return; }
		const subRef = e.target.getAttribute('href');

		this.ignoreClick = true;

		if (this.isExternal()) {
			anchor.setAttribute('target', '');
			anchor.setAttribute('href', this.getHref(item.NTIID, {external: true}));
		}

		const href = path.join(anchor.getAttribute('href'), subRef);

		anchor.setAttribute('href', href);
	}


	getType () {
		const {item} = this.props;
		return [item.type, item.targetMimeType].filter(x => x);
	}


	render () {
		const {
			state: {
				href,
				icon
			},
			props: {
				item,
				contentPackage,
				commentCount,
				disableLink
			}
		} = this;

		const external = this.isExternal();
		const seen = this.isSeen();

		const classes = { external, seen };

		const iconSrc = (seen && !icon) ? BLANK_IMAGE : icon;
		const ref = disableLink || !contentPackage ? null : href;

		const {label, title, desc, description, byline, creator} = item;

		const by = 'byline' in item ? byline : creator;

		return (
			<a className={cx('content-link', 'related-work-ref', classes)}
				href={ref} target={external ? '_blank' : null}
				onClick={this.onClick} ref={this.attachRef}>

				<AssetIcon src={iconSrc} mimeType={this.getType()} href={href}>
					{external && <div className="external"/>}
				</AssetIcon>

				<h5 {...rawContent(label || title)}/>
				{by && by.trim().length > 0 && <div className="label" {...rawContent('By ' + by)/*TODO: localize*/}/>}
				<div className="description" {...rawContent(description || desc)}/>
				<div className="comment-count" href="/discussions/" onClick={this.onClickDiscussion}>
					{commentCount == null
						? null
						: typeof commentCount === 'number'
							? t('comments', {count: commentCount})
							: commentCount
					}
				</div>
			</a>
		);
	}
}
