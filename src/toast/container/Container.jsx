import PropTypes from 'prop-types';
import cx from 'classnames';

import { Locations } from '../Constants';
import ZStack from '../../flyout/ZBooster';

import Region from './Region';

const styles = stylesheet`
	.container {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.container.global {
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: var(--nt-app-top-offset, 0);
	}
`;

const RegionOrder = [Locations.Top, Locations.TopRight];

ToastContainer.propTypes = {
	className: PropTypes.string,
	global: PropTypes.bool,
	location: PropTypes.oneOf(Object.values(Locations)),
	toasts: PropTypes.arrayOf(
		PropTypes.shape({
			location: PropTypes.oneOf(Object.values(Locations)),
		})
	),
};
export default function ToastContainer({
	location,
	className,
	global: globalToast,
	toasts,
	...otherProps
}) {
	const regions = toasts.reduce((acc, toast) => {
		const toastLocation = location || toast.location;

		if (!acc[toastLocation]) {
			acc[toastLocation] = [];
		}

		acc[toastLocation].push(toast);

		return acc;
	}, {});

	return (
		<ZStack
			data-toast-container="yes"
			className={cx(styles.container, className, {[styles.global]: globalToast})}
			{...otherProps}
		>
			{RegionOrder.map(name => {
				if (!regions[name] || !regions[name].length) {
					return null;
				}

				return (
					<Region key={name} location={name} toasts={regions[name]} />
				);
			}).filter(Boolean)}
		</ZStack>
	);
}
