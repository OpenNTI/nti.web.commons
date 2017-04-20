import React from 'react';
import PropTypes from 'prop-types';
import Logger from 'nti-util-logger';
import {getServer} from 'nti-web-client';
import {REQUEST_ERROR_EVENT} from 'nti-lib-interfaces';

const logger = Logger.get('nti:commons:DeauthListener');

const DEAUTH_CODES = {
	401: true,
	403: true,
};

export default class DeauthListener extends React.Component {
	static propTypes = {
		basePath: PropTypes.string.isRequired
	}

	constructor (...args) {
		super(...args);
		this.emitter = getServer();
	}

	componentDidMount () {
		this.emitter.addListener(REQUEST_ERROR_EVENT, this.onError);
	}


	componentWillUnmount () {
		this.emitter.removeListener(REQUEST_ERROR_EVENT, this.onError);
	}


	onError = (err) => {
		const {basePath} = this.props;
		if (DEAUTH_CODES[err.statusCode] && typeof location !== 'undefined') {
			logger.info('XHR recieved an `%d: Not Authorized`, needs reauth. Redirecting to: %s', err.statusCode, basePath);
			location.replace(basePath);
		}
	}


	render = () => null
}
