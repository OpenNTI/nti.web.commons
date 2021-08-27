import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { DropZone } from '../../drag-and-drop/';

import Styles from './FileInputWrapper.css';

const cx = classnames.bind(Styles);

export default class FileInputWrapper extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.any,
		style: PropTypes.any,
		onChange: PropTypes.func,
	};

	fileChanged(files, e) {
		const { onChange } = this.props;

		if (onChange) {
			onChange(files, e);
		}
	}

	onChange = e => {
		e.preventDefault();

		const { target: { files = [] } = {} } = e;

		this.fileChanged(files, e);
	};

	onDrop = e => {
		const { files } = e.dataTransfer;

		this.fileChanged(files, e);
	};

	render() {
		const { className, children, style, ...otherProps } = this.props;

		delete otherProps.onChange;

		return (
			<DropZone
				className={cx('nti-file-input-wrapper', className)}
				style={style}
				onDrop={this.onDrop}
			>
				{children}
				<input type="file" {...otherProps} onChange={this.onChange} />
			</DropZone>
		);
	}
}
