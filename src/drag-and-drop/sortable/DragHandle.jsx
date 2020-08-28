import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Gripper} from '../../icons';

import Styles from './DragHandler.css';

const cx = classnames.bind(Styles);

DragHandle.propTypes = {
	className: PropTypes.string,
	connect: PropTypes.func,
	disabled: PropTypes.bool
};
export default function DragHandle ({className, connect = x => x, disabled}) {
	return connect(
		<div className={cx('drag-handle', className, {disabled})}>
			<Gripper className={cx('drag-icon')} />
		</div>
	);
}
