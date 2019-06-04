import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { restProps } from '@nti/lib-commons';

import DropZone from '../DropZone';

import Styles from './View.css';

const cx = classnames.bind(Styles);

const messagePropType = PropTypes.oneOfType([
	PropTypes.string,
	PropTypes.node,
	PropTypes.func
]);

export default class DropZoneIndicator extends React.Component {
	static propTypes = {
		children: PropTypes.any,
		className: PropTypes.string,

		validDragOver: messagePropType,
		invalidDragOver: messagePropType,

		dragOverClassName: PropTypes.string,
		validDragOverClassName: PropTypes.string,
		invalidDragOverClassName: PropTypes.string,
	}


	render () {
		const {
			className,
			children,
			dragOverClassName,
			validDragOverClassName,
			invalidDragOverClassName
		} = this.props;
		const otherProps = restProps(DropZoneIndicator, this.props);

		return (
			<DropZone
				className={cx('nti-dropzone-indicator', className)}
				dragOverClassName={cx('nti-dropzone-indicator-drag-over', dragOverClassName)}
				validDragOverClassName={cx('nti-dropzone-indicator-valid-drag-over', validDragOverClassName)}
				invalidDragOverClassName={cx('nti-dropzone-indicator-invalid-drag-over', invalidDragOverClassName)}

				{...otherProps}
			>
				<div className={cx('background')} />
				{children}
			</DropZone>
		);
	}
}