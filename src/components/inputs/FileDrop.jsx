import './FileDrop.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import cx from 'classnames';

import { DropZoneIndicator, DropZone } from '../../drag-and-drop';

const DEFAULT_TEXT = {
	title: 'Drag an Image to Upload, or',
	choose: 'Choose a File',
	requirements: 'Must be a .jpg or a .png under 10MB.',
	wrongType: 'File type is unsupported.',
	tooLarge: 'File is too large.',
	unknownError: 'Unable to upload file.',
};

const t = scoped('web-commons.inputs.FileDrop', DEFAULT_TEXT);
const invalidClassName = 'invalid-dragover-filedrop';

export default class Upload extends React.Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		onError: PropTypes.func,
		value: PropTypes.object,
		getString: PropTypes.func,
		sizeLimit: PropTypes.number,
		allowedTypes: PropTypes.object,
		error: PropTypes.string,
		className: PropTypes.string,
	};

	state = {};

	onError(error, className) {
		const { onError } = this.props;

		if (onError) {
			onError(error);
		} else {
			this.setState({ error, errorClass: className });
		}
	}

	clearError() {
		if (this.state.error) {
			this.setState({ error: null, errorClass: null });
		}
	}

	get getString() {
		const { getString } = this.props;

		return getString ? t.override(getString) : t;
	}

	onFileChange = file => {
		const { onChange, allowedTypes, sizeLimit } = this.props;

		if (!file) {
			return;
		}

		// NTI-6986 - IE and Edge don't always provide file.type. If we don't have a type
		// let it through for now.
		// TODO: deduce type from file.name
		if (
			allowedTypes &&
			(file.type || '').length > 0 &&
			!allowedTypes[file.type]
		) {
			this.onError(this.getString('wrongType'), invalidClassName);
			return;
		}

		if (file.size > sizeLimit) {
			this.onError(this.getString('tooLarge'), invalidClassName);
			return;
		}

		this.clearError();
		onChange(file);
	};

	onDrop = e => {
		const { files } = e.dataTransfer;

		this.onFileChange(files && files[0]);
	};

	onFileInputChange = e => {
		e.preventDefault();

		const files = e.target.files;
		const file = files && files[0];

		this.onFileChange(file);
	};

	onFileRemove = () => {
		const { onChange } = this.props;

		if (this.input) {
			this.input.value = '';
		}

		// pass empty to onChange, effectively indicating removal
		onChange();
	};

	renderFileName() {
		return (
			<div className={cx('file-name')}>
				<div className={cx('name')}>
					{this.props.value && this.props.value.name}
				</div>
				<div onClick={this.onFileRemove} className={cx('remove-file')}>
					<i className="icon-light-x" />
				</div>
			</div>
		);
	}

	attachRef = x => {
		this.input = x;
	};

	render() {
		const { getString } = this;
		const { error: propError, className, value, allowedTypes } = this.props;
		const { error: stateError, errorClass } = this.state;
		const error = propError || stateError;

		const acceptDrops = allowedTypes
			? DropZone.acceptFilesOfType(Object.keys(allowedTypes))
			: null;

		return (
			<DropZoneIndicator
				className={cx(
					'nti-web-commons-filedrop',
					className,
					errorClass
				)}
				accepts={acceptDrops}
				validDragOverClassName="valid-dragover-filedrop"
				invalidDragOverClassName={invalidClassName}
				invalidDropClassName={invalidClassName}
				onDrop={this.onDrop}
				onDragEnter={this.clearError}
				onDragOver={this.clearError}
			>
				<input
					type="file"
					ref={this.attachRef}
					className="asset-file"
					onChange={this.onFileInputChange}
				/>
				<div className="container">
					<i className="icon-upload" />
					<span className="title">{getString('title')}</span>
					{value ? (
						this.renderFileName()
					) : (
						<div className="choose-container">
							<span className="choose">
								{getString('choose')}
							</span>
						</div>
					)}
					{error && (
						<div className={cx('error-container', { error })}>
							<span className="error">{error || 'no error'}</span>
						</div>
					)}
				</div>
				<div className="requirements-container">
					<span className="requirements">
						{getString('requirements')}
					</span>
				</div>
			</DropZoneIndicator>
		);
	}
}
