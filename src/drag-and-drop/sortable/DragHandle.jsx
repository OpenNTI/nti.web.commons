import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import {Gripper} from '../../icons';

import Styles from './DragHandler.css';

const cx = classnames.bind(Styles);

DragHandle.propTypes = {
	connect: PropTypes.func,
	disabled: PropTypes.bool
};
export default function DragHandle ({connect, disabled}) {
	return (
		<div className={cx('drag-handle', {disabled})}>
			<Gripper className={cx('drag-icon')} />
		</div>
	);
}
