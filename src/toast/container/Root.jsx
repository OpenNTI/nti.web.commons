import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Locations} from '../Constants';
import Context from '../Context';

import Styles from './Styles.css';
import Region from './Region';


const cx = classnames.bind(Styles);

ToastContainerRoot.propTypes = {
	className: PropTypes.string,
	location: PropTypes.oneOf(Object.values(Locations)),
	as: PropTypes.any,
	children: PropTypes.any
};
export default function ToastContainerRoot ({location, className, children, as:tag, ...otherProps}) {
	const Cmp = tag || 'div';

	const toastCount = React.useRef(0);
	const [toasts, setToasts] = React.useState([]);
	const hasToasts = toasts.length > 0;
	const regions = toasts.reduce((acc, toast) => {
		const toastLocation = location || toast.location;

		if (!acc[toastLocation]) { acc[toastLocation] = []; }

		acc[toastLocation].push(toast);

		return acc;
	}, {});

	const context = {
		getNextId () {
			toastCount.current += 1;
			return toastCount.current.toString();
		},

		addToast (toast) {
			setToasts([...toasts, toast]);
		},

		removeToast () {

		}
	};

	return (
		<Context.Provider value={context}>
			<Cmp className={cx('toast-root', className)} {...otherProps}>
				{children}
				{!hasToasts ? null : (
					<div className={cx('toast-container')}>
						{
							Object
								.entries(regions)
								.map(([name, regionToasts]) => (
									<Region key={name} location={name} toasts={regionToasts} />
								))
						}
					</div>
				)}
			</Cmp>
		</Context.Provider>
	);
}