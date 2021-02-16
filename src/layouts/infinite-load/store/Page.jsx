import React from 'react';
import PropTypes from 'prop-types';

export default class InfiniteLoadStorePage extends React.Component {
	static propTypes = {
		pageIndex: PropTypes.number.isRequired,
		pageHeight: PropTypes.number,
		isScrolling: PropTypes.bool,
		renderPage: PropTypes.func.isRequired,
		store: PropTypes.shape({
			loadPage: PropTypes.func,
			cancelLoadPage: PropTypes.func,
		}),
	};

	state = { loading: true };

	componentDidUpdate(prevProps) {
		const { pageIndex: newIndex } = this.props;
		const { pageIndex: oldIndex } = prevProps;

		if (newIndex !== oldIndex) {
			this.cleanupFor(prevProps);
			this.setupFor(this.props);
		}
	}

	componentDidMount() {
		this.setupFor(this.props);
	}

	componentWillUnmount() {
		this.cleanupFor(this.props);
	}

	cleanupFor(props = this.props) {
		const { store, pageIndex } = props;
		const { loading } = this.state;

		this.canceledLoads = this.canceledLoads || {};

		if (loading) {
			this.canceledLoads[pageIndex] = true;

			if (store.cancelLoadPage) {
				store.cancelLoadPage(pageIndex);
			}
		}
	}

	setupFor(props = this.props) {
		const { store, pageIndex } = this.props;

		this.setState(
			{
				loading: true,
				error: null,
			},
			async () => {
				try {
					//infinite-load list is 0 index but our pages are 1 indexed
					const page = await store.loadPage(pageIndex + 1);

					if (!this.canceledLoads || !this.canceledLoads[pageIndex]) {
						this.setState({
							loading: false,
							error: null,
							page,
						});
					}
				} catch (e) {
					if (
						!this.canceledLoadFor ||
						!this.canceledLoads[pageIndex]
					) {
						this.setState({
							loading: false,
							error: e,
							page: null,
						});
					}
				} finally {
					if (this.canceledLoadFor) {
						delete this.canceledLoadFor[pageIndex];
					}
				}
			}
		);
	}

	render() {
		const { renderPage, pageIndex, isScrolling, pageHeight } = this.props;
		const { loading, error, page } = this.state;

		const styles = loading ? { height: pageHeight } : {};

		return (
			<div style={styles}>
				{renderPage({
					loading,
					error,
					page,
					pageIndex,
					pageHeight,
					isScrolling,
				})}
			</div>
		);
	}
}
