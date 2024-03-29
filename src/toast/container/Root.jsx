import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Locations } from '../Constants';
import Context from '../Context';

import Container from './Container';

ToastContainerRoot.propTypes = {
	className: PropTypes.string,
	location: PropTypes.oneOf(Object.values(Locations)),
	as: PropTypes.any,
	children: PropTypes.any,
};
export default function ToastContainerRoot({
	location,
	className,
	children,
	as: tag,
	...otherProps
}) {
	const Cmp = tag || 'div';

	const idCount = useRef(0);
	const toastRaw = useRef([]);
	const [toasts, setToasts] = useState([]);

	const updateToasts = () => {
		clearTimeout(updateToasts.timeout);

		updateToasts.timeout = setTimeout(() => {
			setToasts(toastRaw.current);
		}, 100);
	};

	const context = {
		getNextId() {
			idCount.current += 1;
			return `toast-${idCount.current}`;
		},

		addToast(toast) {
			toastRaw.current = [...toastRaw.current, toast];
			updateToasts();
		},

		updateToast(id, data) {
			toastRaw.current = toastRaw.current.map(toast =>
				toast.id === id ? { ...toast, ...data } : toast
			);

			updateToasts();
		},

		removeToast(id) {
			toastRaw.current = toastRaw.current.filter(
				toast => toast.id !== id
			);

			updateToasts();
		},
	};

	return (
		<Context.Provider value={context}>
			<Cmp className={cx(className)} {...otherProps}>
				{children}
				<Container toasts={toasts} location={location} />
			</Cmp>
		</Context.Provider>
	);
}
