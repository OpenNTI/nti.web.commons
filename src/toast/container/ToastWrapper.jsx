import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Uncontrolled} from '../../layouts';
import {Monitor} from '../../components';

import Styles from './Styles.css';

const cx = classnames.bind(Styles);

MountToast.propTypes = {
	mountPoint: PropTypes.any,
	toast: PropTypes.shape({
		contents: PropTypes.any,
		layout: PropTypes.any,
		style: PropTypes.any
	})
};
function MountToast ({mountPoint, toast}) {
	const {contents, ...props} = toast;

	return ReactDOM.createPortal(
		React.cloneElement(contents, props),
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

	const onHeightChange = (node, height) => {
		try {
			node.style.setProperty('--known-height', `${height}px`);
		} catch (e) {
			//swallow
		}
	};

	return (
		<Monitor.ChildHeight
			className={cx('toast-wrapper', className)}
			as="li"
			childSelector="[data-toast-id]"
			onHeightChange={onHeightChange}
		>
			<Uncontrolled
				onMount={onMount}
				onUnmount={onUnmount}
				data-toast-id={toast.id}
			/>
			{mountPoint && (
				<MountToast mountPoint={mountPoint} toast={toast} />
			)}
		</Monitor.ChildHeight>
	);
}