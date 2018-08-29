import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import cx from 'classnames';
import invariant from 'invariant';

import NavigatableMixin from '../mixins/NavigatableMixin';
import VisibleComponentTracker from '../visible-component-tracker';

function buildHref (page, props, scope) {
	let ctx = props.navigatableContext;
	if (ctx && !ctx.makeHref) {
		console.warn('navigatableContext missing "makeHref" method'); //eslint-disable-line no-console
	}
	if (!ctx || !ctx.makeHref) {
		ctx = scope;
	}

	return page && {href: ctx.makeHref(page.ref, false) + '/', title: page.title};
}

const get = (x, key) => x && x[key] ? {[key]: x[key]} : {};
const getProps = x => ({ ...get(x, 'href'), ...get(x, 'title')});

export default createReactClass({
	mixins: [NavigatableMixin],
	displayName: 'Pager',

	propTypes: {
		/**
		 * An object that provides an interface to get the current/prev/next
		 * PageSourceItem-like objects.
		 * @type {Store}
		 */
		pageSource: PropTypes.object,

		/**
		 * An object that has at least two properties: href, title
		 *	This prop represents the forward link.
		 * @type {PageSourceItem}
		 */
		next: PropTypes.object,

		/**
		 * An object that has at least two properties: href, title
		 * 	This prop represents the backward link.
		 * @type {PageSourceItem}
		 */
		prev: PropTypes.object,

		/**
		 * The "current" page ID (ntiid)
		 * @type {string}
		 */
		current: PropTypes.string,

		/**
		 * The imposed content root.
		 * @type {string}
		 */
		root: PropTypes.string,


		/**
		 * Describes which style this pager will take on. "bottom" vs Default.
		 * @type {string}
		 */
		position: PropTypes.string,


		/**
		 * Sometimes this Pager component will be rendered inside a higher-level component.
		 * So theMixins.NavigatableMixin#makeHref() method will produce the incorrect url. This
		 * allows for specifying whom should make the href.
		 *
		 * @type {ReactElement}
		 */
		navigatableContext: PropTypes.shape({
			makeHref: PropTypes.func
		}),

		/**
		 * Tells if it is a real page number content
		 */
		isRealPages: PropTypes.bool,

		toc: PropTypes.object
	},

	contextTypes: {
		isMobile: PropTypes.bool
	},

	getInitialState () {
		return {
			next: {},
			prev: {},
			currentPage: 0
		};
	},

	attachDOMRef (x) {this.el = x;},

	componentDidMount () {

		this.setup(this.props);

		if (this.props.isRealPages) {
			VisibleComponentTracker.addGroupListener('real-page-numbers', this.onVisibleChange);
		}
	},

	componentDidUpdate (prevProps) {
		const {el: dom} = this;
		if (dom) {
			for (let a of dom.querySelectorAll('a[href=""]')) {
				a.removeAttribute('href');
			}
		}

		if (prevProps.current !== this.props.current) {
			this.setup(this.props);
		}
	},

	componentWillUnmount () {
		if (this.props.isRealPages) {
			VisibleComponentTracker.removeGroupListener('real-page-numbers', this.onVisibleChange);
		}
	},

	setup (props) {
		const { pageSource: source, current, root, isRealPages, toc } = props;
		const pages = source && source.getPagesAround(current, root);

		let currentPage;
		let total;

		if (isRealPages && toc) {
			const { realPageIndex } = toc || {};
			const allPages = realPageIndex && realPageIndex.NTIIDs[(root || source.root).getID()];
			total = allPages && allPages[allPages.length - 1];
			currentPage = realPageIndex && realPageIndex.NTIIDs[current][0];
		} else {
			currentPage = pages ? pages.index + 1 : 0;
			total = pages ? pages.total : 0;
		}

		let { prev = buildHref(pages.prev, this.props, this) || {}, next = buildHref(pages.next, this.props, this) || {} } = props;

		next = getProps(next);
		prev = getProps(prev);

		this.setState({
			currentPage,
			next,
			prev,
			total
		});
	},

	onVisibleChange (visible) {
		const page = visible && visible[0] && visible[0].data.pageNumber;

		if (page) {
			this.setState({ currentPage: page });
		}
	},


	render () {
		const {context: {isMobile}, } = this;
		const { pageSource: source, position, isRealPages } = this.props;
		const { prev, next, total, currentPage } = this.state;

		const cls = cx('pager', {mobile: isMobile, desktop: !isMobile, realPage: isRealPages });
		const bottomClassName = cx('bottompager', { realPage: isRealPages });

		if (source) {
			invariant(
				!this.props.next && !this.props.prev,
				'[Pager] A value was passed for `next` and/or `prev` as well as a `pageSource`. ' +
				'The prop value will be honored over the state value derived from the pageSource.'
			);
		}

		if (!prev.href && !next.href) {
			return null;
		}

		return (position === 'bottom') ? (
			<ul className={bottomClassName} ref={this.attachDOMRef}>
				<li><a {...prev} className="button secondary tiny radius">Back</a></li>
				<li className="counts">{total > 1 && this.makeCounts(currentPage, total)}</li>
				<li><a {...next} className="button secondary tiny radius">Next</a></li>
			</ul>
		) : (
			<div className={cls} ref={this.attachDOMRef}>
				{total > 1 && this.makeCounts(currentPage, total)}
				<a className="prev" {...prev} />
				<a className="next" {...next} />
			</div>
		);
	},


	makeCounts (page, total) {
		return (
			<div className="counts">
				<strong>{page}</strong> of <strong>{total}</strong>
			</div>
		);
	}
});
