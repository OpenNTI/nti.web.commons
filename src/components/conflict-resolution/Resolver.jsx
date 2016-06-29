import React from 'react';

import {getServer} from 'nti-web-client';
import {REQUEST_CONFLICT_EVENT} from 'nti-lib-interfaces';

import {modal} from '../../prompts';
import ConfirmPrompt from './ConfirmPrompt';

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


	onConflict = (prompt) => {
		return new Promise(confirm => {
			modal(
				<ConfirmPrompt challenge={prompt} onConfirm={confirm} />
			);
		})
			.then(() => prompt.confirm());
	}


	render () { return null; }
}
