import React from 'react';
import {addClass, removeClass} from 'nti-lib-dom';

export default React.createClass({
	displayName: 'DarkMode',


	componentDidMount () {
		addClass(document.body, 'dark');
	},


	componentWillUnmount () {
		removeClass(document.body, 'dark');
	},

	render () {
		return null;
	}
});
