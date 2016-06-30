import React from 'react';
import cx from 'classnames';

import {ItemChanges} from '../../../../HighOrderComponents';

import AssetIcon from '../../../AssetIcon';

import Entity from '../../Entity';


class File extends Entity {

	render () {
		const {props: {item, selection}, state: {rename}} = this;
		const selected = selection.isSelected(item);
		const renameable = item.can('rename');
		const mimeType = item.getFileMimeType();
		const filename = item.getFileName();
		const imgSrc = /image/i.test(mimeType) ? item.getURL() : void 0;
		const image = !imgSrc ? null : imgSrc;

		return (
			<div className={cx('entity file-asset', {renameable, renaming: rename, selected})}
				role="button"
				aria-label={filename}
				draggable
				tabIndex="0"

				onKeyDown={this.onSelect}
				onClick={this.onSelect}
				onDoubleClick={this.onTrigger}
				>
				<div className="select">
					<div className="file-asset-icon">
						{!imgSrc && ( <AssetIcon mimeType={mimeType} href={filename} svg/> )}
						{imgSrc && ( <img src={image}/> )}
					</div>
					<div className="filename">
						<span>{filename}</span>
						{rename && (
							<input type="text"
							ref={this.attachInputRef}
							onBlur={this.onCommitRename}
							onKeyDown={this.onFilenameKeyDown}
							defaultValue={filename}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default ItemChanges.compose(File);
