import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Page from './Page';
import {initPages} from './utils';

export default class InfiniteLoadContainer extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		store: PropTypes.shape({
			getTotalCount: PropTypes.func.isRequired
		}),

		pageComponent: PropTypes.element,
		pageProps: PropTypes.object,
		defaultPageHeight: PropTypes.number,

		renderLoading: PropTypes.func,
		renderError: PropTypes.func,
		renderEmpty: PropTypes.func
	}

	state = {}

	get scrollingEl () {
		return document && document.scrollingElement;
	}

	componentDidMount () {
		this.setUpFor(this.props);

		//TODO: listen for scroll and the store to emit a reload
	}


	componentWillUnmount () {
		//TODO: remove listeners
	}


	componentWillReceiveProps (nextProps) {
		const {store: newStore} = nextProps;
		const {store: oldStore} = this.props;

		if (newStore !== oldStore) {
			this.setUpFor(nextProps);
		}
	}


	setUpFor (props = this.props) {
		const {store, defaultPageHeight} = this.props;

		this.setState({
			loading: true,
			error: null
		}, async () => {
			try {
				const totalCount = await store.getTotalCount();
				const {pages, buffer} = initPages(totalCount, defaultPageHeight, this.scrollingEl);

				this.setState({
					loading: false,
					error: null,
					buffer,
					pages
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


	render () {
		const {className,} = this.props;
		const {loading, error, pages} = this.state;

		return (
			<div className={cx('infinite-loader', className)}>
				{loading && (this.renderLoading())}
				{!loading && error && (this.renderError(error))}
				{!loading && !error && (!pages || !pages.length)  && (this.renderEmpty())}
				{pages && pages.map((page) => this.renderPage(page))}
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


	renderPage (page) {
		const {key, index, minPageHeight, visible} = page;
		const {pageComponent, pageProps, store} = this.props;

		return (
			<Page
				key={key}
				pageKey={key}
				pageIndex={index}
				pageComponent={pageComponent}
				pageProps={pageProps}
				minPageheight={minPageHeight}
				store={store}
				visible={visible}
			/>
		);
	}
}
