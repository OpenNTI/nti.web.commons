import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import Styles from './Triggered.css';
import Dialog from './Dialog';

const cx = classnames.bind(Styles);

TriggeredDialog.propTypes = {
	trigger: PropTypes.any,
};
export default function TriggeredDialog({ trigger, ...otherProps }) {
	const [open, setOpen] = useState(!trigger);

	const focused = useRef(false);
	const blurTimeout = useRef(null);

	const onBeforeDismiss = (...args) => (
		setOpen(false), otherProps?.onBeforeDismiss?.(...args)
	);

	const triggerProps = {
		onFocus: () => {
			focused.current = true;
			clearTimeout(blurTimeout.current);
		},
		onBlur: () => {
			blurTimeout.current = setTimeout(
				() => (focused.current = false),
				100
			);
		},
		onKeyPress: e => {
			if (focused.current && e.charCode === 13 && !open) {
				setOpen(true);
			}
		},

		onClick: () => !open && setOpen(true),

		//accessibility props
		tabIndex: 0,
		'aria-haspopup': 'dialog',

		className: cx('dialog-trigger', trigger?.props?.className),
	};

	const triggerCmp = trigger
		? React.cloneElement(trigger, { ...triggerProps })
		: null;

	return (
		<>
			{triggerCmp}
			{open && (
				<Dialog {...otherProps} onBeforeDismiss={onBeforeDismiss} />
			)}
		</>
	);
}
