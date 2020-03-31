import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Locations} from '../Constants';

import Styles from './Styles.css';
import Region from './Region';

const cx = classnames.bind(Styles);

const RegionOrder = [
	Locations.Top,
	Locations.TopRight
];

ToastContainer.propTypes = {
	className: PropTypes.string,
	location: PropTypes.oneOf(Object.values(Locations)),
	toasts: PropTypes.arrayOf(
		PropTypes.shape({
			location: PropTypes.oneOf(Object.values(Locations))
		})
	)
};
export default function ToastContainer ({location, className, toasts, ...otherProps}) {
	const regions = toasts.reduce((acc, toast) => {
		const toastLocation = location || toast.location;

		if (!acc[toastLocation]) { acc[toastLocation] = []; }

		acc[toastLocation].push(toast);

		return acc;
	}, {});

	return (
		<div className={cx('toast-container', className)} {...otherProps}>
			{
				RegionOrder
					.map((name) => {
						if (!regions[name] || !regions[name].length) { return null; }

						return (<Region key={name} location={name} toasts={regions[name]} />);
					})
					.filter(Boolean)
			}
		</div>
	);
}