import React, {PropTypes} from 'react';
import cx from 'classnames';
import {FileAPI, Selection} from 'nti-commons';
import {getEventTarget} from 'nti-lib-dom';
import Logger from 'nti-util-logger';
import Grid from './layout/grid';

const stop = e => e.stopPropagation();

const logger = Logger.get('common:components:content-resources:View');

const DRAG_CLASS = 'entity-drag-over';

export default class ContentResourcesView extends React.Component {

	static propTypes = {
		children: PropTypes.any,
		className: PropTypes.string,
		onDragOverChanged: PropTypes.func,
		onFileDrop: PropTypes.func,
		onSortChanged: PropTypes.func,
		layout: PropTypes.func,//React Component "Type"
		limited: PropTypes.bool,
		contents: PropTypes.array,
		selection: PropTypes.instanceOf(Selection.Model),
		sort: PropTypes.object
	}

	dragover = 0


	attachRef = x => this.viewEl = x


	clearSelection = (e) => (!e.metaKey && !e.ctrlKey) && this.props.selection.set()


	allowDrops = () => !this.props.limited


	onDragOver = (e) => {
		e.preventDefault();
		if (!e.isDefaultPrevented()) {
			e.dataTransfer.dropEffect = this.allowDrops() && accepts(e) ? 'move' : 'none';

			logger.debug('dragover');
		}

		clearTimeout(this.dragOverStopped);
		this.dragOverStopped = setTimeout(this.onDragLeaveImplied, 100);
	}


	onDragEnter = (e) => {
		if (!this.allowDrops() || !accepts(e)) {
			return;
		}

		this.dragover++;

		const target = getEventTarget(e, '.view-main-pane');
		if (target) {
			target.classList.add(DRAG_CLASS);
		}

		logger.debug('dragEnter', this.dragover, e.target);

		const {onDragOverChanged} = this.props;
		if (this.dragover === 1 && onDragOverChanged) {
			onDragOverChanged(true);
		}
	}


	onDragLeave = (e) => {
		if (!this.allowDrops() || !accepts(e)) {
			return;
		}

		const target = getEventTarget(e, '.view-main-pane');

		this.dragover--;
		if (target && this.dragover <= 0) {
			this.dragover = 0; //force 0
		}

		logger.debug('dragLeave', this.dragover, e.target);

		if (this.dragover === 0) {
			this.onDragLeaveImplied();
		}
	}


	onDragLeaveImplied = () => {
		clearTimeout(this.dragOverStopped);
		this.dragover = 0; //force 0
		if (this.viewEl) {
			this.viewEl.classList.remove(DRAG_CLASS);
		}

		const {onDragOverChanged} = this.props;
		if (onDragOverChanged) {
			onDragOverChanged(false);
		}
	}


	onDrop = (e) => {
		e.stopPropagation();
		e.preventDefault();
		this.onDragLeave(e);

		if (!this.allowDrops()) {
			return;
		}

		const {files:transferFiles, items} = e.dataTransfer;
		let files = transferFiles;

		if (items) {
			files = FileAPI.getFilesFromDataTransferItems(items);
		}

		const {onFileDrop} = this.props;
		if (onFileDrop && files && files.length > 0) {
			onFileDrop(files);
		}
	}


	render () {
		const {children, className, contents, selection, layout, sort, onSortChanged} = this.props;
		const hasSubView = !!children;

		const Layout = layout || Grid;

		return (
			<div className={cx('content-resource-view', className, {split: hasSubView})} onClick={this.clearSelection}>
				<div ref={this.attachRef} className="view-main-pane"
					onDragOver={this.onDragOver}
					onDragEnter={this.onDragEnter}
					onDragLeave={this.onDragLeave}
					onDrop={this.onDrop}
					>
					<Layout contents={contents} selection={selection} sort={sort} onSortChanged={onSortChanged}/>
				</div>
				{hasSubView && (
					<div className="context-view-pane" onClick={stop}>{children}</div>
				)}
			</div>
		);
	}
}


function accepts (e) {
	const {files, items, types} = e.dataTransfer;
	const file = /file/i;

	return (files && files.length > 0) ||
			Array.from(items || {}).some(x => file.test(x.kind)) ||
			Array.from(types || {}).some(x => file.test(x));
}
