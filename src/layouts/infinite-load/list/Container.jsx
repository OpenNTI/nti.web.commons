import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Events} from 'nti-commons';

import ChildHeightMonitor from '../ChildHeightMonitor';
import {initPageState, updatePageState, fixPageState} from '../utils';


export default class InifiniteLoadList extends React.Component {
	static propTypes = {
		className: PropTypes.string,

		totalPages: PropTypes.number,
		defaultPageHeight: PropTypes.number,
		buffer: PropTypes.number,

		renderPage: PropTypes.func.isRequired,
		renderEmpty: PropTypes.func,
		renderLoading: PropTypes.func
	}

	static contextTypes = {
		infiniteLoadContainer: PropTypes.shape({
			addEventListener: PropTypes.func,
			removeEventListener: PropTypes.func,
			clientHeight: PropTypes.number,
			scrollTop: PropTypes.number
		})
	}

	static defaultProps = {
		buffer: 1
	}

	state = {}

	setContainer = x => this.container = x
	setBeforeContainer = x => this.beforeContainer = x
	setAfterContainer = x => this.afterContainer = x

	get scrollingEl () {
		if (this.context.infiniteLoadContainer) { return this.context.infiniteLoadContainer; }

		return document && {
			addEventListener: (...args) => global.addEventListener(...args),
			removeEventListener: (...args) => global.removeEventListener(...args),
			offsetTop: 0,
			clientHeight: document.documentElement.clientHeight,
			get scrollTop () {
				return document.scrollingElement.scrollTop;
			},
			set scrollTop (top) {
				return document.scrollingElement.scrollTop = top;
			}
		};
	}


	get topOffset () {
		const {scrollingEl, container} = this;

		return container ? container.offsetTop - scrollingEl.offsetTop : 0;
	}

	getPageHeight = (page) => {
		const {defaultPageHeight} = this.props;
		const heights = this.pageHeights || {};

		return heights[page] || defaultPageHeight || 0;
	}


	componentDidMount () {
		this.setupFor(this.props);

		if (Events.supportsPassive()) {
			this.scrollingEl.addEventListener('scroll', this.onScroll, {passive: true});
		} else {
			this.scrollingEl.addEventListener('scroll', this.onScroll);
		}
	}


	componentWillUnmount () {
		if (Events.supportsPassive()) {
			this.scrollingEl.removeEventListener('scroll', this.onScroll, {passive: true});
		} else {
			this.scrollingEl.removeEventListener('scroll', this.onScroll);
		}
	}


	componentWillReceiveProps (nextProps) {
		const {totalPages: newTotal} = nextProps;
		const {totalPages: oldTotal} = this.props;

		if (newTotal !== oldTotal) {
			this.pageHeights = {};
			this.setupFor(nextProps);
		}
	}


	setupFor (props = this.props) {
		const {totalPages, buffer} = props;

		const pageState = totalPages != null && initPageState(totalPages, buffer, this.scrollingEl, this.getPageHeight, this.topOffset);

		this.setState({
			pageState
		});
	}

	onScroll = () => {
		if (this.handlingScroll) {
			this.callScrollAgain = true;
			return;
		}

		if (!this.state.isScrolling) {
			this.setState({
				isScrolling: true
			});
		}

		clearTimeout(this.scrollingTimeout);

		this.scrollingTimeout = setTimeout(() => {
			this.setState({
				isScrolling: false
			});

			if (this.syncOnScrollStop) {
				delete this.syncOnScrollStop;
				this.maybeSync();
			}
		}, 17);

		const {buffer} = this.props;
		const {pageState} = this.state;
		const newPageState = pageState && updatePageState(pageState, buffer, this.scrollingEl, this.getPageHeight, this.topOffset);


		if (newPageState && newPageState.activePages.anchorOffset !== pageState.activePages.anchorOffset) {
			this.handlingScroll = true;

			this.setState({
				pageState: newPageState
			}, () => {
				delete this.handlingScroll;

				if (this.callScrollAgain) {
					delete this.callScrollAgain;

					this.onScroll();
				}
			});
		}
	}


	onHeightChange = (node, height) => {
		this.pageHeights = this.pageHeights || {};

		const pageIndex = node.dataset.pageIndex;
		const sync = this.pageHeights[pageIndex] !== height;

		this.pageHeights[pageIndex] = height;

		if (sync) {
			this.maybeSync();
		}
	}


	maybeSync () {
		if (this.syncScrollTimeout) {
			return;
		}

		this.syncScrollTimeout = setTimeout(() => {
			delete this.syncScrollTimeout;
			delete this.syncOnScrollStop;

			if (this.state.isScrolling || !this.beforeContainer || !this.afterContainer) {
				this.syncOnScrollStop = true;
				return;
			}

			const {buffer} = this.props;
			const {pageState} = this.state;
			const fixedPageState = fixPageState(pageState, buffer, this.scrollingEl, this.getPageHeight, this.topOffset);

			if (fixedPageState.scrollTop === pageState.scrollTop) { return; }

			const {activePages, totalHeight} = fixedPageState;
			const {anchorOffset} = activePages;

			this.container.style.height = `${totalHeight}px`;
			this.beforeContainer.style.bottom = `${totalHeight - anchorOffset}px`;
			this.afterContainer.style.top = `${anchorOffset}px`;

			this.scrollingEl.scrollTop = fixedPageState.scrollTop;

			this.setState({
				pageState: fixedPageState
			});
		}, 100);

	}


	render () {
		const {className, totalPages} = this.props;
		const {pageState} = this.state;

		const styles = pageState ? {height: pageState.totalHeight} : {};

		return (
			<div
				className={cx('nti-infinite-load-list', className)}
				style={styles}
				ref={this.setContainer}
			>
				{!pageState && (this.renderLoading())}
				{pageState && (!totalPages) && (this.renderEmpty())}
				{pageState && (totalPages) && (this.renderPageState())}
			</div>
		);
	}


	renderLoading () {
		const {renderLoading} = this.props;

		return renderLoading ? renderLoading() : null;
	}


	renderEmpty () {
		const {renderEmpty} = this.props;

		return renderEmpty ? renderEmpty() : null;
	}


	renderPageState () {
		const {pageState} = this.state;
		const {activePages, totalHeight} = pageState;
		const {before, after, anchorOffset} = activePages;


		return (
			<React.Fragment>
				<div className="pages before" style={{bottom: totalHeight - anchorOffset}} ref={this.setBeforeContainer}>
					<ChildHeightMonitor
						childSelector="[data-page-index]"
						onHeightChange={this.onHeightChange}
					>
						{before.map(page => this.renderPage(page))}
					</ChildHeightMonitor>
				</div>
				<div className="pages after" style={{top: anchorOffset}} ref={this.setAfterContainer}>
					<ChildHeightMonitor
						childSelector="[data-page-index]"
						onHeightChange={this.onHeightChange}
					>
						{after.map(page => this.renderPage(page))}
					</ChildHeightMonitor>
				</div>
			</React.Fragment>
		);
	}


	renderPage (page) {
		const {renderPage} = this.props;

		return (
			<div className="infinite-load-list-page" data-page-index={page} key={page}>
				{renderPage({
					pageIndex: page,
					pageHeight: this.getPageHeight(page),
					isScrolling: this.state.isScrolling
				})}
			</div>
		);
	}
}
