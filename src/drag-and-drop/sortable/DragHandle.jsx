import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Gripper} from '../../icons';
import Context from '../Context';

import Styles from './DragHandler.css';

const cx = classnames.bind(Styles);

DragHandle.propTypes = {
	className: PropTypes.string,
	connect: PropTypes.func,
	disabled: PropTypes.bool,

	onMouseDown: PropTypes.func,
	onMouseUp: PropTypes.func
};
export default function DragHandle ({
	className,
	connect = x => x,
	disabled,
	onMouseDown,
	onMouseUp
}) {
	const Draggable = React.useContext(Context);

	React.useEffect(() => Draggable?.addDragHandle?.(), []);

	const innerMouseDown = (e) => (
		!disabled && Draggable?.enableDrag?.(),
		onMouseDown?.(e)
	);

	const innerMouseUp = (e) => (
		Draggable?.disableDrag?.(),
		onMouseUp?.(e)
	);

	return connect(
		<div
			className={cx('drag-handle', className, {disabled})}
			onMouseDown={innerMouseDown}
			onMouseUp={innerMouseUp}
		>
			<Gripper className={cx('drag-icon')} />
		</div>
	);
}
