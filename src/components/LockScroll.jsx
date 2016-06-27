import React from 'react';
import {addClass, removeClass} from 'nti-lib-dom';

export default React.createClass({
	displayName: 'LockScroll',


	componentDidMount () {
		addClass(document.body.parentNode, 'scroll-lock');
	},


	componentWillUnmount () {
		removeClass(document.body.parentNode, 'scroll-lock');
	},

	render () {
		return null;
	}
});
