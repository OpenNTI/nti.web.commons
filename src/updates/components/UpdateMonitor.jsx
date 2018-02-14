import React from 'react';
import PropTypes from 'prop-types';
import {InactivityMonitor} from 'nti-lib-dom';
import {URL as UrlUtils} from 'nti-commons';
import Logger from 'nti-util-logger';

import Notification from './Notification';

const logger = Logger.get('common:update-monitor');

const parseVersionFromTextFile = txt => (txt || '').split(/\n/)[0].split(' ')[0];

export default class UpdateMonitor extends React.Component {
	static propTypes = {
		baseUrl: PropTypes.string.isRequired,
		versionPath: PropTypes.string.isRequired,
		getVersionString: PropTypes.func.isRequired
	}

	static defaultProps = {
		versionPath: 'js/version',
		getVersionString: parseVersionFromTextFile
	}

	state = {}

	componentDidMount () {
		const monitor = this.activeStateMonitor = new InactivityMonitor();
		this.unsubscribe = monitor.addChangeListener(this.onActiveStateChanged);

		this.check();
	}


	componentWillUnmount () {
		this.unsubscribe();
		this.unsubscribe = () => {};

		this.unmounted = true;
		this.setState = () => {};
	}


	componentDidUpdate (prevProps, {version: previous}) {
		const {version} = this.state;

		if (previous && previous !== version) {
			logger.log('There is an update available: %s', version);
			this.setState({update: true});
		}
		else if (!previous && version) {
			logger.debug('Version recorded %s', version);
		}
	}


	onActiveStateChanged = (active) => {
		logger.debug('Active State changed. (active: %s)', active);
		if (active) {
			this.check();
		}
	}


	check = async () => {
		const {baseUrl, versionPath} = this.props;

		if (!baseUrl || !versionPath) {
			return;
		}

		const r = await fetch (UrlUtils.join(baseUrl, versionPath), {
			method: 'GET',
			headers: {
				// 'pragma': 'no-cache',
				// 'cache-control': 'no-cache'
			}
		});

		if (!r.ok) {
			this.setState({version: 'unknown'});
			return logger.warn('%s %s: %s', r.status, r.statusText, r.url);
		}

		const txt = await r.text();

		const version = this.props.getVersionString(txt);

		if (this.state.version !== version) {
			this.setState({version});
		}
	}


	render () {
		return this.state.update ? (
			<Notification/>
		) : (
			null
		);
	}
}
