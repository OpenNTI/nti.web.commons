import React from 'react';
import ReactDOM from 'react-dom';

const CMP_TO_MOUNT_POINT = new WeakMap();

const ID_ATTR = 'data-mount-point-id';

function getDefaultParent () {
	return document.body;
}


export default class MountPoint {
	constructor (key, parent) {
		this.className = key;
		this.appendTo = parent || getDefaultParent();

		this.seenCount = 0;
	}


	getNewPoint () {
		const mountPoint = document.createElement('div');

		mountPoint.classList.add(this.className);
		mountPoint.addAttribute(ID_ATTR, `${this.className}-${this.seenCount}`);

		this.appendTo.appendChild(mountPoint);

		return mountPoint;
	}


	getPointForId (id) {
		const selector = `.${this.className}[${ID_ATTR}=${id}]`;

		return document.querySelector(selector);
	}


	getAllPoints () {
		const selector = `.${this.className}`;

		return document.querySelectorAll(selector);
	}


	mount (cmpCls, props) {
		const point = this.getNewPoint();
		const id = point.getAttribute(ID_ATTR);

		const cmp = React.createElement(cmpCls, props);

		ReactDOM.render(cmp, point);

		CMP_TO_MOUNT_POINT.set(cmp, id);

		return cmp;
	}


	unmount (cmp) {
		if (!cmp) {
			return this.unmountAll();
		}

		const id = CMP_TO_MOUNT_POINT.get(cmp);
		const point = this.getPointForId(id);

		if (point) {
			document.body.removeChild(point);
		}
	}


	unmountAll () {
		//TODO: fill this out
	}
}
