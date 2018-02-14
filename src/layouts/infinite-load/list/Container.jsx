import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Events} from 'nti-commons';

import ChildHeightMonitor from '../ChildHeightMonitor';
import {initPageState, updatePageState} from '../utils';


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

	static defaultProps = {
		buffer: 1
	}

	state = {}

	setContainer = x => this.container = x
	setBeforeContainer = x => this.beforeContainer = x
	setAfterContainer = x => this.afterContainer = x

	get scrollingEl () {
		return document && {
			scrollTop: document.scrollingElement.scrollTop,
			clientHeight: document.documentElement.clientHeight
		};
	}

	getPageHeight = (page) => {
		const {defaultPageHeight} = this.props;
		const heights = this.pageHeights || {};

		return heights[page.key] || defaultPageHeight || 0;
	}


	componentDidMount () {
		this.setupFor(this.props);

		if (Events.supportsPassive()) {
			global.addEventListener('scroll', this.onScroll, {passive: true});
		} else {
			global.addEventListener('scroll', this.onScroll);
		}
	}


	componentWillUnmount () {
		if (Events.supportsPassive()) {
			global.removeEventListener('scroll', this.onScroll, {passive: true});
		} else {
			global.removeEventListener('scroll', this.onScroll);
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

		const pageState = totalPages != null && initPageState(totalPages, buffer, this.scrollingEl, this.getPageHeight);

		this.setState({
			pageState
		});
	}


	onScroll = () => {
		if (this.handlingScroll) {
			this.callScrollAgain = true;
			return;
		}

		const {buffer} = this.props;
		const {pageState} = this.state;
		const updatedPageState = pageState && updatePageState(pageState, buffer, this.scrollingEl, this.getPageHeight);

		if (updatedPageState && updatedPageState !== pageState) {
			this.handlingScroll = true;

			this.setState({
				pageState: updatedPageState
			}, () => {
				setTimeout(() => {
					delete this.handlingScroll;

					if (this.callScrollAgain) {
						delete this.callScrollAgain;

						this.onScroll();
					}
				}, 17);
			});
		}
	}


	onHeightChange = (node, height) => {
		const pageKey = node.dataset.pageKey;

		this.pageHeights = this.pageHeights || {};

		this.pageHeights[pageKey] = height;
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
		const {before, after, anchor, anchorOffset} = activePages;


		return (
			<React.Fragment>
				<div className="pages before" style={{bottom: totalHeight - anchorOffset}} ref={this.setBeforeContainer}>
					<ChildHeightMonitor
						childSelector="[data-page-key]"
						onHeightChange={this.onHeightChange}
					>
						{before.map(page => this.renderPage(page))}
					</ChildHeightMonitor>
				</div>
				<div className="pages active after" style={{top: anchorOffset}} ref={this.setActiveContainer}>
					<ChildHeightMonitor
						childSelector="[data-page-key]"
						onHeightChange={this.onHeightChange}
					>
						{this.renderPage(anchor)}
						{after.map(page => this.renderPage(page))}
					</ChildHeightMonitor>
				</div>
			</React.Fragment>
		);
	}


	renderPage (page) {
		const {key, index} = page;
		const {renderPage} = this.props;

		return (
			<div className="infinite-load-list-page" data-page-key={key} key={key}>
				{renderPage({
					pageKey: key,
					pageIndex: index,
					pageHeight: this.getPageHeight(page)
				})}
			</div>
		);
	}
}
