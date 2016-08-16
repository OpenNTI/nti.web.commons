import React from 'react';
import ReactDOM from 'react-dom';
import {setRefOnProps} from '../utils/mergeRefHandlers';

const MOUNT_POINT_NODE = Symbol('Mount Point Node');


function makeMountPoint (cls) {
	const point = document.createElement('div');

	point.classList.add(cls);
	point.setAttribute('data-is-remote-mount-point', true);

	return point;
}


class MountPoint {
	constructor (parent, className) {
		this.className = className;
		this.parent = parent;
	}

	setChild = x => this.child = x;

	get mountPoint () {
		const {parent, className} = this;

		if (!this[MOUNT_POINT_NODE]) {
			this[MOUNT_POINT_NODE] = makeMountPoint(className);
			parent.appendChild(this[MOUNT_POINT_NODE]);
		}

		return this[MOUNT_POINT_NODE] || this;
	}


	render (cmpCls, props, children) {
		return new Promise ((fulfill) => {
			ReactDOM.render(
				React.createElement(cmpCls, setRefOnProps(props, this.setChild), children),
				this.mountPoint,
				fulfill
			);
		});
	}


	remove () {
		ReactDOM.unmountComponentAtNode(this.mountPoint);
		parent.removeChild(this.mountPoint);
	}
}


export function createMountPoint (appendTo, cls) {
	return new MountPoint(appendTo, cls);
}
