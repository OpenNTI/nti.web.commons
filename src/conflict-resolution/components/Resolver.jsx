import React from 'react';

import {getServer} from 'nti-web-client';
import {REQUEST_CONFLICT_EVENT} from 'nti-lib-interfaces';

import defaultConflictHandler from '../default-handler';

import Registry from '../Registry';

export default class Resolver extends React.Component {

	constructor (...args) {
		super(...args);
		this.emitter = getServer();
	}

	componentDidMount () {
		this.emitter.addListener(REQUEST_CONFLICT_EVENT, this.onConflict);
	}


	componentWillUnmount () {
		this.emitter.removeListener(REQUEST_CONFLICT_EVENT, this.onConflict);
	}


	onConflict = (challenge) => {
		return Registry.handleConflict(challenge) || defaultConflictHandler(challenge);
	}


	render () { return null; }
}
