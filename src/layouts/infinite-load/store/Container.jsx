import React from 'react';
import PropTypes from 'prop-types';

import List from '../list';

import Page from './Page';

export default class InfiniteStoreLoad extends React.Component {
	static propTypes = {
		store: PropTypes.shape({
			getTotalCount: PropTypes.func.isRequired
		}).isRequired,

		renderPage: PropTypes.func.isRequired,
		renderLoading: PropTypes.func,
		renderError: PropTypes.func
	}

	state = {
		totalPages: null
	}


	componentDidMount () {
		this.setupFor(this.props);
	}


	componentDidUpdate (prevProps) {
		const {store: newStore} = this.props;
		const {store: oldStore} = prevProps;

		if (newStore !== oldStore) {
			this.setupFor(this.props);
		}
	}


	setupFor (props = this.props) {
		const {store} = this.props;

		this.setState({
			total: null,
			error: null
		}, async () => {
			try {
				const totalPages = await store.getTotalCount();

				this.setState({
					totalPages,
					error: null
				});
			} catch (e) {
				this.setState({
					totalPages: null,
					error: e
				});
			}
		});
	}


	render () {
		const {...otherProps} = this.props;
		const {totalPages} = this.state;

		delete otherProps.store;

		return (
			<List
				{...otherProps}
				totalPages={totalPages}
				renderPage={this.renderPage}
				renderLoading={this.renderLoading}
			/>
		);
	}


	renderLoading = () => {
		const {renderLoading, renderError} = this.props;
		const {error} = this.state;

		if (error && renderError) {
			return renderError();
		}

		if (renderLoading) {
			return renderLoading();
		}

		return null;
	}


	renderPage = ({pageIndex, pageKey, isScrolling, pageHeight}) => {
		const {renderPage, store} = this.props;

		return (
			<Page store={store} pageKey={pageKey} pageIndex={pageIndex} pageHeight={pageHeight} isScrolling={isScrolling} renderPage={renderPage} />
		);
	}
}
