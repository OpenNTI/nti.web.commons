import classnames from 'classnames/bind';

import {createMountPoint} from '../remote-mount';

import Styles from './GlobalRoot.css';
import Container from './container/Container';

const cx = classnames.bind(Styles);

let idCount = 0;
let toasts = [];
let mountPoint = null;

const getMountPoint = () => {
	if (!mountPoint) {
		const appendTo = global.document?.body;

		mountPoint = createMountPoint(appendTo, cx('global-toast-root'), true);
	}

	return mountPoint;
};

const cleanUpMountPoint = () => {
	if (mountPoint) {
		mountPoint.remove();
		mountPoint = null;
	}
};

const updateToasts = () => {
	if (!toasts.length) {
		cleanUpMountPoint();
	} else {
		getMountPoint()?.render(Container, {toasts, className: cx('global-toast-container')});
	}
};

const GlobalToastRoots = {
	getNextId () {
		idCount += 1;

		return `global-toast-${idCount}`;
	},

	addToast (toast) {
		toasts = [...toasts, toast];
		updateToasts();
	},

	updateToast (id, data) {
		toasts = toasts
			.map(toast => toast.id === id ? ({...toast, ...data}) : toast);
		
		updateToasts();
	},

	removeToast (id) {
		toasts = toasts
			.filter(toast => toast.id !== id);

		updateToasts();
	}
};

export default GlobalToastRoots;