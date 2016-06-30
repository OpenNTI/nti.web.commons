import React from 'react';
import {addClass, removeClass} from 'nti-lib-dom';

export default React.createClass({
	displayName: 'DarkMode',


	componentDidMount () {
		addClass(document.body, 'darkmode');
	},


	componentWillUnmount () {
		removeClass(document.body, 'darkmode');
	},

	render () {
		return null;
	}
});
