import React from 'react';
import {addClass, removeClass} from 'nti-lib-dom';

export default class extends React.Component {
	static displayName = 'DarkMode';

	componentDidMount () {
		addClass(document.body, 'darkmode');
	}

	componentWillUnmount () {
		removeClass(document.body, 'darkmode');
	}

	render () {
		return null;
	}
}
