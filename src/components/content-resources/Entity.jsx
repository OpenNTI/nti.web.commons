import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import {addClass, removeClass, getEventTarget, getFragmentFromString} from 'nti-lib-dom';
import {FileAPI, Selection, Events, cooloff as getCoolOff, Parsing} from 'nti-commons';
import Logger from 'nti-util-logger';

import FileDragImageTemplate from './assets/FileDragImage.template.svg';

const logger = Logger.get('common:components:content-resources:Entity');

function getFileDragImage (count) {
	const digets = Number(count).toString().length;
	const width = (digets * 6) + 11;
	const x = 62 - (digets * 3);

	return FileDragImageTemplate
		.replace(/\{count\}/g, count)
		.replace(/\{width\}/g, width)
		.replace(/\{x\}/g, x);
}

function getDetachedNodeFrom (exp) {
	let frag = getFragmentFromString(exp);
	return frag.firstChild;
}

export default class Entity extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		selection: PropTypes.instanceOf(Selection.Model)
	}

	static contextTypes = {
		onTrigger: PropTypes.func.isRequired,
		onFolderDrop: PropTypes.func,
		canSelectItem: PropTypes.func.isRequired,
		selectItem: PropTypes.func.isRequired
	}

	dragover = 0

	state = {}

	componentDidMount () {
		const {item} = this.props;
		item.addListener('rename', this.onBeginRename);
	}

	componentWillUnmount () {
		const {item} = this.props;
		item.removeListener('rename', this.onBeginRename);
	}

	componentDidUpdate (prevProps) {
		const {item} = this.props;
		const {item: prev} = prevProps;
		if (item !== prev) {
			prev.removeListener('rename', this.onBeginRename);
			item.addListener('rename', this.onBeginRename);
		}
	}

	componentWillReceiveProps (nextProps) {
		if (this.props.item !== nextProps.item) {
			//eslint-disable-next-line react/no-direct-mutation-state
			this.setState(this.state = {});
		}
	}


	isInDragSet () {
		const {selection, item} = this.props;
		const {dragging = []} = selection;
		return dragging.includes(item);
	}


	onDragStart = (e) => {
		const {target} = e;
		let {offsetWidth: width, offsetHeight: height} = target;
		const {selection, item} = this.props;

		const dragging = selection.isSelected(item) ? Array.from(selection) : [item];
		selection.set(dragging);

		const count = dragging.length;
		const image = count <= 1
			? target.cloneNode(true)
			: getDetachedNodeFrom(getFileDragImage(count));

		this.onDragEnd();

		selection.dragging = dragging;
		this.dragImage = image;

		image.removeAttribute('draggable');
		addClass(image, 'content-dragged-asset');
		addClass(image, 'ghost');

		if (image.tagName !== 'SVG') {
			image.style.width = width + 'px';
		} else {
			height = image.offsetHeight;
			width = image.offsetWidth;
		}

		document.body.appendChild(image);

		const {dataTransfer: tx} = e;
		tx.effectAllowed = 'move';
		tx.setData('application/json', JSON.stringify(dragging));
		tx.setDragImage(image, width / 2, height / 2);

		selection.emit('change', 'drag-start');
	}


	onDragEnd = (e) => {
		const {selection} = this.props;
		delete selection.dragging;
		if (this.dragImage) {
			document.body.removeChild(this.dragImage);
			delete this.dragImage;
		}

		if (e) {
			selection.emit('change', 'drag-end');
		}
	}


	onDragOver = (e) => {
		if (!this.canDrop()) { return; }
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
	}


	onDragEnter = (e) => {
		if (!this.canDrop()) { return; }
		if (!this.isInDragSet()) {
			this.dragover++;
			const target = getEventTarget(e, '.entity');
			if (target) {
				addClass(target, 'entity-drag-over');
			}
		}
	}


	onDragLeave = (e) => {
		if (!this.canDrop()) { return; }
		const target = getEventTarget(e, '.entity');
		this.dragover--;
		if (target && this.dragover <= 0) {
			this.dragover = 0; //force 0
			removeClass(target, 'entity-drag-over');
		}
	}


	onDrop = (e) => {
		e.stopPropagation();
		e.preventDefault();

		const {
			context: {
				onFolderDrop
			},
			props: {
				item,
				selection
			}
		} = this;

		if (!this.canDrop()) { return; }

		const isFile = !item.isFolder;
		const isSelected = selection.isSelected(item);
		const isBegingDragged = (selection.dragging || []).includes(item);

		//If we're not a folder, we do not accept drops.
		//If we're a folder, but in the current dragging set, we are invalid targets.
		if (isFile || isSelected || isBegingDragged) {
			logger.debug('Ignoring Drop. isFile: %s, isSelected: %s, isBegingDragged: %s',
				isFile,
				isSelected,
				isBegingDragged
			);
			return;
		}

		this.onDragLeave(e);

		const {dataTransfer: dt} = e;
		const data = Parsing.parseJSON(dt.getData('application/json')); //just returns null on parse error
		const {files:transferFiles, items} = dt;
		let files = transferFiles;

		if (items) {
			files = FileAPI.getFilesFromDataTransferItems(items);
		}

		onFolderDrop(item, data, files);
	}


	canSelect = () => {
		const {canSelectItem} = this.context;
		if (!canSelectItem) { return true; }
		return canSelectItem(this.props.item);
	}


	canDrag = () => typeof this.context.onFolderDrop === 'function'
	canDrop = () => this.canDrag() && this.props.item.isFolder


	attachInputRef = (ref) => {
		if (ref) {
			ref.focus();
			// ref.select(); <- doesn't work on all browser *caugh* safari *caugh*
			ref.setSelectionRange(0, ref.value.length);
		}
	}


	onBeginRename = (e) => {
		const {selection, item} = this.props;
		if (!selection.isSelected(item)) { return; }

		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		if (item.can('rename')) {
			const filename = item.getFileName();
			const ext = path.extname(filename);
			const rename = (item.isFolder ? filename : path.basename(filename, ext)) || filename;

			this.setState({rename});
		}
	}


	onCommitRename = (e) => {
		const {item} = this.props;
		const {target: {value}} = e;
		const v = value.trim();
		const oldName = item.getFileName();
		const ext = path.extname(oldName);
		const newName = (item.isFolder || path.extname(v) === ext) ? v : (v + ext);

		if (newName !== oldName) {
			item.rename(newName);
		}

		this.onFinishRename();
	}


	onFinishRename () {
		const {item} = this.props;
		item.emit('rename-end');
		this.setState({rename: false});
	}


	onSelect = (e) => {
		const {metaKey, altKey, ctrlKey, shiftKey} = e;
		const {item} = this.props;

		if (!Events.isActionable(e)) { return; }

		if (!shiftKey) { //if shift was pressed, let this bubble up
			e.preventDefault();
			e.stopPropagation();
		}

		this.context.selectItem(item, { metaKey, altKey, ctrlKey, shiftKey });
	}


	onTrigger = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (e.metaKey || e.ctrlKey || this.state.rename) { return; }

		if (getCoolOff(this.onTrigger)) {
			return;
		}

		const {props: {item}, context: {onTrigger}} = this;

		onTrigger(item);
	}


	onFilenameKeyDown = (e) => {
		e.stopPropagation();
		const {key} = e;
		if (key === 'Enter') {
			e.target.blur();
		} else if (key === 'Escape') {
			this.onFinishRename();
		}
	}


	render () {
		return (
			<div>Your class is missing a render method, or called super.</div>
		);
	}
}
