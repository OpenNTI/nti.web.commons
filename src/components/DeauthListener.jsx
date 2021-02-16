import React from 'react';
import PropTypes from 'prop-types';
import Logger from '@nti/util-logger';
import { getServer } from '@nti/web-client';
import { REQUEST_ERROR_EVENT } from '@nti/lib-interfaces';

const logger = Logger.get('common:DeauthListener');

const DEAUTH_CODES = {
	401: true,
	//Example of checking a status code...(returning true means request is not authenticated and needs to re-login)
	// 403: (response) => response.headers.has('WWW-Authenticate')
};

export default class DeauthListener extends React.Component {
	static propTypes = {
		basePath: PropTypes.string.isRequired,
	};

	constructor(...args) {
		super(...args);
		this.emitter = getServer();
	}

	componentDidMount() {
		this.emitter.addListener(REQUEST_ERROR_EVENT, this.onError);
	}

	componentWillUnmount() {
		this.emitter.removeListener(REQUEST_ERROR_EVENT, this.onError);
	}

	onError = err => {
		const { basePath } = this.props;
		const AuthCheck = DEAUTH_CODES[err.statusCode];

		const hasBeenDeauthorized =
			typeof AuthCheck === 'function'
				? AuthCheck(err.response)
				: AuthCheck;

		if (hasBeenDeauthorized && typeof global.location !== 'undefined') {
			logger.info(
				'XHR recieved an `%d: Not Authorized`, needs reauth. Redirecting to: %s',
				err.statusCode,
				basePath
			);
			global.location.replace(basePath);
		}
	};

	render = () => null;
}
