import React from 'react';
import cx from 'classnames';

import {ItemChanges} from '../../../../HighOrderComponents';
import {DateTime} from '../../../../';
import Entity from '../../Entity';


class Folder extends Entity {

	render () {
		const {props: {item, selection}, state: {rename}} = this;
		const selected = selection.isSelected(item) && !rename;
		const renameable = item.can('rename');
		const filename = item.getFileName();
		const unselectable = !this.canSelect();

		return (
			<tr className={cx('entity entity-row', {selected, unselectable, dragging: this.isInDragSet()})}
				onKeyDown={this.onSelect}
				onClick={this.onSelect}
				onDoubleClick={this.onTrigger}
			>
				<td className="column-name"
					onDragOver={this.onDragOver}
					onDragEnter={this.onDragEnter}
					onDragLeave={this.onDragLeave}
					onDrop={this.onDrop}
				>
					<div className={cx('entity-row-item row-folder-asset', {renameable, renaming: rename})}
						role="button"
						aria-label={filename}
						draggable={!rename && this.canDrag() ? true : null}
						tabIndex="0"

						onDragEnd={this.canDrag() && this.onDragEnd}
						onDragStart={this.canDrag() && this.onDragStart}
					>
						<div className="icon-column"><i className="icon-folder small"/></div>
						<div className="filename">
							<span onClick={this.onTrigger}>{filename}</span>
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
					</div>
				</td>

				<td className="column-date"><DateTime date={item.getLastModified()}/></td>

				<td className="column-type">Folder</td>
			</tr>
		);
	}
}

export default ItemChanges.compose(Folder);
