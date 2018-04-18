import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';

const t = scoped('web-common.iframe.Header', {
	download: 'Download'
});

export default class IframeHeader extends React.Component {
	static propTypes = {
		src: PropTypes.string,
		title: PropTypes.string,
		downloadable: PropTypes.bool,
		onDismiss: PropTypes.func
	}


	onDismiss = () => {
		const {onDismiss} = this.props;

		if (onDismiss) {
			onDismiss();
		}
	}


	render () {
		return (
			<div className="nti-iframe-header">
				{this.renderTitle()}
				{this.renderDownload()}
				{this.renderDismiss()}
			</div>
		);
	}


	renderTitle () {
		const {title} = this.props;

		return title ?
			(<div className="title">{title}</div>) :
			(<div className="spacer" />);
	}


	renderDownload () {
		const {downloadable, src} = this.props;

		if (!downloadable || !src) { return; }

		return (
			<a className="download" href={src} download>
				<i className="icon-upload" />
				<span>{t('download')}</span>
			</a>
		);
	}

	renderDismiss () {
		return (
			<i className="icon-light-x dismiss" onClick={this.onDismiss} />
		);
	}
}
