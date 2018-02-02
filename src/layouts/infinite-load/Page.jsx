import React from 'react';
import PropTypes from 'prop-types';

export default class InfiniteLoadPage extends React.Component {
	static propTypes = {
		pageKey: PropTypes.string.isRequired,
		pageIndex: PropTypes.number.isRequired,
		pageComponent: PropTypes.element,
		pageProps: PropTypes.object,
		pageHeight: PropTypes.bool,
		store: PropTypes.shape({
			loadPage: PropTypes.func,
			cancelLoadPage: PropTypes.func
		})
	}

	state = {loading: true}

	componentWillReceiveProps (nextProps) {
		const {pageKey:newKey} = nextProps;
		const {pageKey:oldKey} = this.props;

		if (newKey !== oldKey) {
			this.cleanUpFor(this.props);
			this.setUpFor(nextProps);
		}
	}

	componentDidMount () {
		this.setUpFor(this.props);
	}


	componentWillUnmount () {
		this.cleanUpFor(this.props);
	}


	cleanUpFor (props = this.props) {
		const {store, pageIndex, pageKey} = props;
		const {loading} = this.state;

		if (loading && store.cancelLoadPage) {
			this.loadCanceledFor = pageKey;
			store.cancelLoadPage(pageIndex);
		}
	}


	setUpFor (props = this.props) {
		const {store, pageIndex, pageKey} = props;

		this.setState({
			loading: true,
			error: null
		}, async () => {
			try {
				const page = await store.loadPage(pageIndex);

				if (this.loadCanceledFor !== pageKey) {
					this.setState({
						loading: false,
						error: null,
						page
					});
				}
			} catch (e) {
				if (this.loadCanceledFor !== pageKey) {
					this.setState({
						loading: false,
						error: e,
						page: null
					});
				}
			} finally {
				delete this.loadCanceledFor;
			}
		});
	}


	render () {
		const {pageComponent:PageComponent, pageProps, pageKey} = this.props;
		const {loading, page, error} = this.state;

		return (
			<div className="infinite-load-page" data-page-key={pageKey}>
				<PageComponent {...pageProps} loading={loading} page={page} error={error} />
			</div>
		);
	}
}
