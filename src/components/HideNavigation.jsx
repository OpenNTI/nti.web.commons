import React from 'react';
import { addClass, removeClass } from '@nti/lib-dom';

export default class extends React.Component {
	static displayName = 'HideNavigation';

	componentDidMount() {
		addClass(document.body.parentNode, 'hide-nav');
	}

	componentWillUnmount() {
		removeClass(document.body.parentNode, 'hide-nav');
	}

	render() {
		return null;
	}
}
