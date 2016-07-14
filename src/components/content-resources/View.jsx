import React, {PropTypes} from 'react';
import cx from 'classnames';
import {getEventTarget} from 'nti-lib-dom';

import IconGrid from './layout/icon-grid';

const stop = e => e.stopPropagation();


export default class ContentResourcesView extends React.Component {

	static propTypes = {
		children: PropTypes.any,
		className: PropTypes.string,
		onDragOverChanged: PropTypes.func,
		onFileDrop: PropTypes.func,
		layout: PropTypes.func,//React Component "Type"
		limited: PropTypes.bool,
		...IconGrid.propTypes
	}

	dragover = 0


	clearSelection = (e) => (!e.metaKey && !e.ctrlKey) && this.props.selection.set()


	allowDrops = () => !this.props.limited


	onDragOver = (e) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = this.allowDrops() && accepts(e) ? 'move' : 'none';
	}


	onDragEnter = (e) => {
		if (!this.allowDrops() || !accepts(e)) {
			return;
		}

		this.dragover++;

		const target = getEventTarget(e, '.view-main-pane');
		if (target) {
			target.classList.add('entity-drag-over');
		}

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
			target.classList.remove('entity-drag-over');
		}

		const {onDragOverChanged} = this.props;
		if (this.dragover === 0 && onDragOverChanged) {
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

		const {files} = e.dataTransfer;
		const {onFileDrop} = this.props;
		if (onFileDrop && files && files.length > 0) {
			onFileDrop(files);
		}
	}


	render () {
		const {children, className, contents, selection, layout} = this.props;
		const hasSubView = !!children;

		const Layout = layout || IconGrid;

		return (
			<div className={cx('content-resource-view', className, {split: hasSubView})} onClick={this.clearSelection}>
				<div className="view-main-pane"
					onDragOver={this.onDragOver}
					onDragEnter={this.onDragEnter}
					onDragLeave={this.onDragLeave}
					onDrop={this.onDrop}
					>
					<Layout contents={contents} selection={selection}/>
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
