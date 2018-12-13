import React from 'react';
import {addClass, hasClass, removeClass} from '@nti/lib-dom';

const noop = () => {};

function maybeAdd (node, className) {
	if (hasClass(node, className)) {
		return noop;
	}
	addClass(node, className);
	return () => removeClass(node, className);
}

export default class DarkMode extends React.Component {

	componentDidMount () {
		this.remove = maybeAdd(document.body, 'darkmode');
	}

	componentWillUnmount () {
		(this.remove || noop)();
	}

	render () {
		return null;
	}
}
