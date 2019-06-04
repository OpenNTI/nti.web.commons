import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { restProps, FileAPI } from '@nti/lib-commons';

const FILE_REGEX = /file/i;

function acceptAnyFiles (e) {
	const {files, items, types} = e.dataTransfer;

	return (files && files.length > 0) ||
		Array.from(items || {}).some(item => FILE_REGEX.test(item.kind)) ||
		Array.from(types || {}).some(type => FILE_REGEX.test(type));
}

function acceptFilesOfType (types) {
	if (!Array.isArray(types)) {
		types = [types];
	}

	const typeSet = new Set(types);

	return (e) => {
		const {items} = e.dataTransfer;

		for (let item of items) {
			if (FILE_REGEX.test(item.kind) && typeSet.has(item.type)) {
				return true;
			}
		}

		return false;
	};
}

export default class DropZone extends React.Component {
	static acceptAnyFiles = acceptAnyFiles
	static acceptFilesOfType = acceptFilesOfType

	static propTypes = {
		children: PropTypes.any,
		className: PropTypes.string,
		tag: PropTypes.string,

		accepts: PropTypes.func,
		disabled: PropTypes.bool,

		onDrop: PropTypes.func,
		onFileDrop: PropTypes.func,

		dragOverClassName: PropTypes.string,
		validDragOverClassName: PropTypes.string,
		invalidDragOverClassName: PropTypes.string,

		onDragEnter: PropTypes.func,
		onDragLeave: PropTypes.func,
		onDragOver: PropTypes.func,
	}

	attachDropZone = node => this.dropZone = node

	state = {}

	dragEnterLock = 0

	isValidEvent (e) {
		const {accepts} = this.props;

		return !accepts || accepts(e);
	}


	getClassName () {
		const {className, dragOverClassName, validDragOverClassName, invalidDragOverClassName} = this.props;
		const {dragOver, isValid} = this.state;

		let stateClasses = {};

		if (dragOverClassName) {
			stateClasses[dragOverClassName] = dragOver;
		}

		if (validDragOverClassName) {
			stateClasses[validDragOverClassName] = dragOver && isValid;
		}

		if (invalidDragOverClassName) {
			stateClasses[invalidDragOverClassName] = dragOver && !isValid;
		}

		return cx(className, 'nti-drop-zone', stateClasses);
	}

	onDrop = (e) => {
		e.stopPropagation();
		e.preventDefault();

		this.onDragLeave(e);

		const isValid = this.isValidEvent(e);
		const {onDrop, onFileDrop} = this.props;

		if (onDrop) {
			onDrop(e, isValid);
		}

		if (onFileDrop) {
			const {files: transferFiles, items} = e.dataTransfer;
			let files = transferFiles;

			if (items) {
				files = FileAPI.getFilesFromDataTransferItems(items);
			}

			onFileDrop(e, files, isValid);
		}
	}

	onDragEnter = (e) => {
		e.stopPropagation();

		this.dragEnterLock += 1;

		const {onDragEnter} = this.props;
		const isValid = this.isValidEvent(e);

		this.setState({
			dragOver: true,
			isValid
		});

		if (this.dragEnterLock === 1 && onDragEnter) {
			onDragEnter(e, isValid);
		}

	}

	onDragLeave = (e) => {
		e.stopPropagation();

		this.dragEnterLock = Math.max(0, this.dragEnterLock - 1);//don't let it dip below 0

		const {onDragLeave} = this.props;

		if (this.dragEnterLock > 0) { return; }

		this.setState({
			dragOver: false,
			isValid: null
		});

		if (onDragLeave) {
			onDragLeave(e);
		}
	}

	onDragOver = (e) => {
		//These are necessary to get the drop events
		e.preventDefault();
		e.stopPropagation();

		const {onDragOver} = this.props;
		const isValid = this.isValidEvent(e);

		if (onDragOver) {
			onDragOver(e, isValid);
		}
	}


	render () {
		const {tag:Tag = 'div', children} = this.props;
		const extraProps = restProps(DropZone, this.props);

		return (
			<Tag
				className={this.getClassName()}
				ref={this.attachDropZone}
				onDrop={this.onDrop}
				onDragEnter={this.onDragEnter}
				onDragLeave={this.onDragLeave}
				onDragOver={this.onDragOver}
				{...extraProps}
			>
				{children}
			</Tag>
		);
	}
}