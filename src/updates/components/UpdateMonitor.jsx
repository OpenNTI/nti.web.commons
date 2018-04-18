import React from 'react';
import PropTypes from 'prop-types';
import {InactivityMonitor} from '@nti/lib-dom';
import {URL as UrlUtils} from '@nti/lib-commons';
import Logger from '@nti/util-logger';

import Notification from './Notification';

const ONE_MINUTE = 60000;//ms
// const FIFTEEN_MINUTES = 900000;//ms

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

		this.onActiveStateChanged(true);
	}


	componentWillUnmount () {
		this.unsubscribe();
		this.unsubscribe = () => {};

		this.unmounted = true;
		this.setState = () => {};

		this.onActiveStateChanged(false);
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
		this.active = active;

		clearInterval(this.recheck);
		delete this.recheck;

		if (active) {
			this.check();
			// this.recheck = setInterval(this.check, FIFTEEN_MINUTES);
		}
	}


	check = async () => {
		const {
			props: {
				baseUrl,
				versionPath
			},
			state: {
				version: lastVersion,
				update,
			}
		} = this;

		const valid = Boolean(baseUrl && versionPath);

		if (!this.active || !valid || update || (Date.now() - this.lastChecked) < ONE_MINUTE) {
			if (valid && update) {
				this.setState({updated: Date.now()});
			}
			return;
		}

		this.lastChecked = Date.now();

		const r = await fetch (UrlUtils.join(baseUrl, versionPath), {
			method: 'GET',
			headers: {
				'pragma': 'no-cache',
				'cache-control': 'no-cache'
			}
		});

		if (!r.ok) {
			this.setState({version: 'unknown'});
			return logger.warn('%s %s: %s', r.status, r.statusText, r.url);
		}

		const txt = await r.text();

		const version = this.props.getVersionString(txt);

		if (lastVersion !== version) {
			this.setState({version});
		}
	}


	render () {
		return this.state.update ? (
			<Notification lastUpdated={this.state.updated}/>
		) : (
			null
		);
	}
}
