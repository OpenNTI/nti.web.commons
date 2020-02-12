import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Uncontrolled} from '../../layouts';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

MountToast.propTypes = {
	mountPoint: PropTypes.any,
	toast: PropTypes.shape({
		contents: PropTypes.any
	})
};
function MountToast ({mountPoint, toast}) {
	return ReactDOM.createPortal(
		React.cloneElement(toast.contents),
		mountPoint
	);
}

ToastWrapper.propTypes = {
	className: PropTypes.string,
	toast: PropTypes.shape({
		id: PropTypes.string
	})
};
export default function ToastWrapper ({className, toast}) {
	const [mountPoint, setMountPoint] = React.useState(null);

	const onMount = n => setMountPoint(n);
	const onUnmount = () => setMountPoint(null);

	return (
		<>
			<Uncontrolled
				as="li"
				className={cx('toast-wrapper', className)}
				onMount={onMount}
				onUnmount={onUnmount}
				data-toast-id={toast.id}
			/>
			{mountPoint && (
				<MountToast mountPoint={mountPoint} toast={toast} />
			)}
		</>
	);
}