import React from 'react';
import ReactDOM from 'react-dom';
import {addClass} from 'nti-lib-dom';
import {setRefOnProps} from '../utils/mergeRefHandlers';

const MOUNT_POINT_NODE = Symbol('Mount Point Node');


function makeMountPoint (cls) {
	const point = document.createElement('div');

	addClass(point, cls);
	point.setAttribute('data-is-remote-mount-point', true);

	return point;
}


class MountPoint {
	constructor (parent, className) {
		this.className = className;
		this.parent = parent;
	}

	setChild = x => this.child = x

	/**
	 * Return the existing dom node, or create one and append it to the parent
	 * @return {Node} the dom node for this mount point
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
	 * @return {Promise}          fulfills with the cmp that was created
	 */
	render (cmpCls, props, children) {
		return new Promise ((fulfill) => {
			ReactDOM.render(
				React.createElement(cmpCls, setRefOnProps(props, this.setChild), children),
				this.mountPoint,
				() => fulfill(this.child)
			);
		});
	}


	remove () {
		ReactDOM.unmountComponentAtNode(this.mountPoint);

		if (this.parent && this.parent.removeChild) {
			this.parent.removeChild(this.mountPoint);
		}
	}
}

//A utility to create a div and append it the dom to create
//a place to mount new react components
export function createMountPoint (appendTo, cls) {
	return new MountPoint(appendTo, cls);
}
