import React from 'react';
import cx from 'classnames';
import Entity from './Entity';


export default class Folder extends Entity {

	render () {
		const {props: {item, selection}, state: {rename}} = this;
		const selected = selection.isSelected(item);
		const renameable = item.can('rename');
		const filename = item.getFileName();

		return (
			<div className={cx('entity folder-asset', {renameable, selected})}
				role="button"
				aria-label={filename}
				tabIndex="0"
				onKeyDown={this.onSelect}
				onClick={this.onSelect}
				>
				<i className="icon-folder small"/>
				<span className="filename" onClick={this.onBeginRename}>{filename}</span>
				{rename && (
					<input type="text"
						ref={this.attachInputRef}
						className="filename"
						onBlur={this.onCommitRename}
						onKeyDown={this.onFilenameKeyDown}
						defaultValue={filename}
						/>
				)}
			</div>
		);
	}
}
