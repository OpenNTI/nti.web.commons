import React from 'react';
import ReactDOM from 'react-dom';
import {addClass} from '@nti/lib-dom';

const MOUNT_POINT_NODE = Symbol('Mount Point Node');


function makeMountPoint (cls) {
	const point = document.createElement('div');

	addClass(point, cls);
	point.setAttribute('data-is-remote-mount-point', true);

	return point;
}


class MountPoint {
	constructor (parent, className, noPortal) {
		this.className = className;
		this.parent = parent;
		this.isPortal = !noPortal && Boolean(ReactDOM.createPortal);
		this.renderer = this.isPortal ? 'createPortal' : 'render';
	}

	/**
	 * Return the existing dom node, or create one and append it to the parent
	 * @returns {Node} the dom node for this mount point
	 */
	get mountPoint () {
		const {parent, className} = this;

		if (!this[MOUNT_POINT_NODE]) {
			this[MOUNT_POINT_NODE] = makeMountPoint(className);
			parent.appendChild(this[MOUNT_POINT_NODE]);
		}

		return this[MOUNT_POINT_NODE] || this;
	}

	/**
	 * Render a react component at this point
	 * @param  {Object} cmpCls   the react class to render
	 * @param  {Object} props    the props to render the class with
	 * @param  {Object} children the children to render with the class
	 * @returns {*} React opaque pointer... don't use in React15. See portal documentation.
	 */
	render (cmpCls, props, children) {
		return ReactDOM[this.renderer](
			React.createElement(cmpCls, props, children),
			this.mountPoint
		);
	}


	remove () {
		if (!this.isPortal) {
			ReactDOM.unmountComponentAtNode(this.mountPoint);
		}

		if (this.parent && this.parent.removeChild) {
			this.parent.removeChild(this.mountPoint);
		}
	}
}

//A utility to create a div and append it the dom to create
//a place to mount new react components
export function createMountPoint (appendTo, cls, noPortal) {
	return new MountPoint(appendTo, cls, noPortal);
}
