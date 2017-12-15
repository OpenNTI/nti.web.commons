import React from 'react';
import PropTypes from 'prop-types';
import {getServer} from 'nti-web-client';
import {REQUEST_CONFLICT_EVENT} from 'nti-lib-interfaces';

import defaultConflictHandler from '../default-handler';
import contentVersionConflictHandler, {Code} from '../content-version-conflict';
import Registry from '../Registry';

Registry.register(Code, contentVersionConflictHandler);

export default class Resolver extends React.Component {

	static propTypes = {
		noDefault: PropTypes.bool
	}

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
		const {noDefault} = this.props;
		return Registry.handleConflict(challenge) || (
			noDefault
				// return values are ignored... auto reject conflicts if no handler and the
				// app has opted out of the default handler.
				? challenge.reject()
				: defaultConflictHandler(challenge)
		);
	}


	render () { return null; }
}
