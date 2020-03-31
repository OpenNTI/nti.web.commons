import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Locations} from '../Constants';
import Context from '../Context';

import Styles from './Styles.css';
import Container from './Container';


const cx = classnames.bind(Styles);

ToastContainerRoot.propTypes = {
	className: PropTypes.string,
	location: PropTypes.oneOf(Object.values(Locations)),
	as: PropTypes.any,
	children: PropTypes.any
};
export default function ToastContainerRoot ({location, className, children, as:tag, ...otherProps}) {
	const Cmp = tag || 'div';

	const idCount = React.useRef(0);
	const toastRaw = React.useRef([]);
	const [toasts, setToasts] = React.useState([]);

	const updateToasts = () => {
		clearTimeout(updateToasts.timeout);

		updateToasts.timeout = setTimeout(() => {
			setToasts(toastRaw.current);
		}, 100);
	};

	const context = {
		getNextId () {
			idCount.current += 1;
			return `toast-${idCount.current}`;
		},

		addToast (toast) {
			toastRaw.current = [...toastRaw.current, toast];
			updateToasts();
		},


		updateToast (id, data) {
			toastRaw.current = toastRaw.current
				.map(toast => toast.id === id ? ({...toast, ...data}) : toast);

			updateToasts();
		},

		removeToast (id) {
			toastRaw.current = toastRaw.current
				.filter(toast => toast.id !== id);

			updateToasts();
		}
	};

	return (
		<Context.Provider value={context}>
			<Cmp className={cx('toast-root', className)} {...otherProps}>
				{children}
				<Container toasts={toasts} location={location} />
			</Cmp>
		</Context.Provider>
	);
}