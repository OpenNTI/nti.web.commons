import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import cx from 'classnames';

import {Loading} from '../components';

import {getEmbedLink} from './utils';
import Header from './Header';

const t = scoped('nti-web-common.iframe.Viewer', {
	loading: 'Loading',
	error: 'Unable to view contents'
});

export default class IframeViewer extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		src: PropTypes.string.isRequired,
		title: PropTypes.string,

		downloadable: PropTypes.bool,
		config: PropTypes.object,
		format: PropTypes.string,

		loadingMessage: PropTypes.string,
		errorMessage: PropTypes.string,

		onError: PropTypes.func,

		onDismiss: PropTypes.func
	}


	static defaultProps = {
		config: {
			view: 'FitH',
			toolbar: 0,
			navpanes: 0,
			statusbar: 0,
			page: 1
		}
	}


	state = {loading: true, error: null}


	get embedLink () {
		const {src, config, format} = this.props;

		return getEmbedLink(src, config, format);
	}


	onLoad = () => {
		this.setState({
			loading: false
		});
	}


	onError = () => {
		debugger;
		const {onError} = this.props;

		if (onError) {
			onError();
		}

		this.setState({
			loading: false,
			error: true
		});
	}


	render () {
		const {onDismiss, className} = this.props;
		const {loading, error} = this.state;
		const {embedLink} = this;

		return (
			<div className={cx('nti-iframe-viewer', className, {modal: !!onDismiss})}>
				<Header {...this.props} />
				<div className="content">
					{loading && this.renderLoading()}
					{error && !loading && this.renderError()}
					{!error && (
						<iframe
							src={embedLink}
							onLoad={this.onLoad}
							onError={this.onError}
							frameBorder="0"
							marginWidth="0"
							marginHeight="0"
							seamless="true"
							transparent="true"
							allowTransparency="true"
						/>
					)}
				</div>
			</div>
		);
	}


	renderLoading () {
		const {loadingMessage} = this.props;

		return (
			<Loading.Mask message={loadingMessage || t('loading')} />
		);
	}



	renderError () {
		const {errorMessage} = this.props;

		return (
			<span className="error">
				{errorMessage || t('error')}
			</span>
		);
	}
}
