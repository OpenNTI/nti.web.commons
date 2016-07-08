import React from 'react';
import cx from 'classnames';

import {ItemChanges} from '../../../../HighOrderComponents';

import Entity from '../../Entity';


class Folder extends Entity {

	render () {
		const {props: {item, selection}, state: {rename}} = this;
		const selected = selection.isSelected(item);
		const renameable = item.can('rename');
		const filename = item.getFileName();
		const unselectable = !this.canSelect();

		return (
			<div className={cx('entity folder-asset', {renameable, selected, unselectable, dragging: this.isInDragSet()})}
				role="button"
				aria-label={filename}
				draggable={this.canDrag() ? true : null}
				tabIndex="0"

				onKeyDown={this.onSelect}
				onClick={this.onSelect}
				onDoubleClick={this.onTrigger}

				onDragEnd={this.canDrag() && this.onDragEnd}
				onDragStart={this.canDrag() && this.onDragStart}

				onDragOver={this.onDragOver}
				onDragEnter={this.onDragEnter}
				onDragLeave={this.onDragLeave}

				onDrop={this.onDrop}
				>
				<i className="icon-folder small"/>
				<span className="filename" onClick={this.onTrigger}>{filename}</span>
				{rename && (
					<input type="text"
						ref={this.attachInputRef}
						className="filename"
						onBlur={this.onCommitRename}
						onKeyDown={this.onFilenameKeyDown}
						defaultValue={rename}
						/>
				)}
			</div>
		);
	}
}

export default ItemChanges.compose(Folder);
