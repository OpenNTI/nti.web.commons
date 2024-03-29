import { createMountPoint } from '../remote-mount';

import Container from './container/Container';

const styles = stylesheet`
	.global-root {}
`;

let idCount = 0;
let toasts = [];
let mountPoint = null;

const getMountPoint = () => {
	if (!mountPoint) {
		const appendTo = global.document?.body;

		mountPoint = createMountPoint(appendTo, styles.globalRoot, true);
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
		getMountPoint()?.render(Container, {
			toasts,
			global: true
		});
	}
};

const GlobalToastRoots = {
	getNextId() {
		idCount += 1;

		return `global-toast-${idCount}`;
	},

	addToast(toast) {
		toasts = [...toasts, toast];
		updateToasts();
	},

	updateToast(id, data) {
		toasts = toasts.map(toast =>
			toast.id === id ? { ...toast, ...data } : toast
		);

		updateToasts();
	},

	removeToast(id) {
		toasts = toasts.filter(toast => toast.id !== id);

		updateToasts();
	},
};

export default GlobalToastRoots;
