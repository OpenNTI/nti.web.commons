import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Events} from 'nti-commons';

import Page from './Page';
import {initPageState, updatePageState} from './utils';

export default class InfiniteLoadContainer extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		store: PropTypes.shape({
			getTotalCount: PropTypes.func.isRequired
		}),

		pageComponent: PropTypes.element.isRequired,
		defaultPageHeight: PropTypes.number.isRequired,
		pageProps: PropTypes.object,
		buffer: PropTypes.number,

		renderLoading: PropTypes.func,
		renderError: PropTypes.func,
		renderEmpty: PropTypes.func
	}

	static defaultProps = {
		buffer: 1
	}

	state = {}

	setContainer = x => this.container = x

	get scrollingEl () {
		return document && document.scrollingElement;
	}

	componentDidMount () {
		this.setUpFor(this.props);

		global.ref = this;

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
		const {store: newStore} = nextProps;
		const {store: oldStore} = this.props;

		if (newStore !== oldStore) {
			this.setUpFor(nextProps);
		}
	}


	setUpFor (props = this.props) {
		const {store, defaultPageHeight, buffer} = this.props;

		this.setState({
			loading: true,
			error: null
		}, async () => {
			try {
				const totalCount = await store.getTotalCount();
				const pageState = initPageState(totalCount, defaultPageHeight, buffer, this.scrollingEl);

				this.setState({
					loading: false,
					error: null,
					pageState
				});
			} catch (e) {
				this.setState({
					loading: false,
					error: e,
					totalCount: 0
				});
			}
		});
	}


	onScroll = () => {
		if (this.coolDownTimeout) {
			this.callAfterCooldown = true;
			return;
		}

		this.coolDownTimeout = setTimeout(() => {
			delete this.coolDownTimeout;

			if (this.callAfterCooldown) {
				this.onScroll();
				delete this.callAfterCooldown;
			}
		}, 17);

		const {buffer} = this.props;
		const {pageState} = this.state;
		const updatedPageState = updatePageState(pageState, buffer, this.scrollingEl);

		if (updatedPageState !== pageState) {
			this.setState({
				pageState: updatedPageState
			});
		} else {
			console.log('Page State is Equal', updatedPageState, pageState);
		}

	}


	render () {
		const {className,} = this.props;
		const {loading, error, pageState} = this.state;

		const styles = pageState ? {height: pageState.totalHeight} : {};

		return (
			<div className={cx('nti-infinite-loader', className)} style={styles} ref={this.setContainer}>
				{loading && (this.renderLoading())}
				{!loading && error && (this.renderError(error))}
				{!loading && !error && (!pageState || !pageState.pages.length)  && (this.renderEmpty())}
				{!loading && !error && pageState && pageState.pages.length && (this.renderPageState())}
			</div>
		);
	}


	renderLoading () {
		const {renderLoading} = this.props;

		return renderLoading ? renderLoading() : null;
	}


	renderError (error) {
		const {renderError} = this.props;

		return renderError ? renderError(error) : null;
	}


	renderEmpty () {
		const {renderEmpty} = this.props;

		return renderEmpty ? renderEmpty () : null;
	}


	renderPageState () {
		const {pageState} = this.state;
		const {visiblePages, visibleOffset} = pageState;

		const styles = {top: visibleOffset};

		return (
			<div className="visible-pages" style={styles}>
				{
					visiblePages.map(page => this.renderPage(page))
				}
			</div>
		);
	}


	renderPage (page) {
		const {key, index, pageHeight} = page;
		const {pageComponent, pageProps, store} = this.props;

		return (
			<Page
				key={key}
				pageKey={key}
				pageIndex={index}
				pageComponent={pageComponent}
				pageProps={pageProps}
				pageHeight={pageHeight}
				store={store}
			/>
		);
	}
}
