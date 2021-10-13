import { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { Gripper } from '../../icons';
import Context from '../Context';

import Styles from './DragHandler.css';

const cx = classnames.bind(Styles);

DragHandle.propTypes = {
	className: PropTypes.string,
	connect: PropTypes.func,
	disabled: PropTypes.bool,

	onMouseDown: PropTypes.func,
	onMouseUp: PropTypes.func,
};
export default function DragHandle({
	className,
	connect,
	disabled,
	onMouseDown,
	onMouseUp,
}) {
	const Draggable = useContext(Context);
	const connector = connect ?? (x => x);

	useEffect(() => {
		if (!connect) {
			Draggable?.addDragHandle?.();
		}
	}, []);

	const listeners = connect
		? {}
		: {
				onMouseDown: e => (
					!disabled && Draggable?.enableDrag?.(), onMouseDown?.(e)
				),
				onMouseUp: e => (Draggable?.disableDrag?.(), onMouseUp?.(e)),
		  };

	return connector(
		<div
			className={cx('drag-handle', className, { disabled })}
			{...listeners}
		>
			<Gripper className={cx('drag-icon')} />
		</div>
	);
}
