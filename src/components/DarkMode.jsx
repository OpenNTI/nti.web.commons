import React from 'react';
import {addClass, removeClass} from '@nti/lib-dom';

function add (node, className) {
	add.count = (add.count || 0) + 1;
	addClass(node, className);
	return () => {
		add.count = Math.max(add.count - 1, 0); // ensure we're never negative. shouldn't happen anyway.
		if (!add.count) {
			removeClass(node, className);
		}
	};
}

export default class DarkMode extends React.Component {

	componentDidMount () {
		this.remove = add(document.body, 'darkmode');
	}

	componentWillUnmount () {
		this.remove();
	}

	render () {
		return null;
	}
}
