import './LockScroll.scss';
import React from 'react';
import {addClass, removeClass} from '@nti/lib-dom';

export default class LockScroll extends React.Component {
	static refCount = 0;

	componentDidMount () {
		LockScroll.refCount++;
		addClass(document.body.parentNode, 'scroll-lock');
	}

	componentWillUnmount () {
		LockScroll.refCount--;

		if (LockScroll.refCount <= 0) {
			LockScroll.refCount = 0;
			removeClass(document.body.parentNode, 'scroll-lock');
		}
	}

	render () {
		return null;
	}
}
