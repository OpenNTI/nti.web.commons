import React from 'react';
import PropTypes from 'prop-types';

export default class InfiniteLoadPage extends React.Component {
	static propTypes = {
		pageKey: PropTypes.string.isRequired,
		pageIndex: PropTypes.number.isRequired,
		pageComponent: PropTypes.element,
		pageProps: PropTypes.object,
		minPageHeight: PropTypes.bool,
		visible: PropTypes.bool,
		store: PropTypes.shape({
			loadPage: PropTypes.func,
			cancelLoadPage: PropTypes.func
		})
	}

	state = {visible: false}

	componentDidMount () {
		this.setUpFor(this.props);
	}

	componentWillReceiveProps (nextProps) {
		const {pageIndex: newIndex, visible: newVisible} = nextProps;
		const {pageIndex: oldIndex, visible: oldVisible} = this.props;

		if (newIndex !== oldIndex || newVisible !== oldVisible) {
			this.setUpFor(nextProps);
		}
	}


	setUpFor (props = this.props) {
		const {visible} = props;

		if (visible) {
			this.setUpVisible(props);
		} else {
			this.setUpInvisbile(props);
		}
	}


	setUpVisible (props = this.props) {
		const {store, pageIndex} = props;
		const {loading} = this.state;

		//if we are already loading there's no need to do anything
		if (loading) { return; }

		this.setState({
			visible: true,
			loading: true,
			error: null
		}, async () => {
			try {
				const page = await store.loadPage(pageIndex);

				const {visible} = this.state;

				if (visible) {
					this.setState({
						loading: false,
						error: null,
						page
					});
				}

			} catch (e) {
				const {visible} = this.state;

				if (visible) {
					this.setState({
						loading: false,
						error: e,
						page: null
					});
				}
			}
		});
	}


	setUpInvisbile (props = this.props) {
		const {store, pageIndex} = props;
		const {loading} = this.state;

		this.setState({
			visible: false,
			loading: false,
			error: null,
			page: null
		});

		if (loading && store.cancelPageLoad) {
			store.cancelPageLoad(pageIndex);
		}
	}


	render () {
		const {pageComponent:PageComponent, pageProps, pageKey, minPageHeight} = this.props;
		const {visible, loading, page, error} = this.state;

		const style = visible ? {} : {minHeight: `${minPageHeight}px`};

		return (
			<div className="infinite-load-page" data-page-key={pageKey} style={style}>
				{visible && (<PageComponent {...pageProps} loading={loading} page={page} error={error} />)}
			</div>
		);
	}
}
