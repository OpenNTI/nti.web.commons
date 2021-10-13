import './File.scss';
import { extname } from 'path';

import cx from 'classnames';
import mime from 'mime-types';

import { ItemChanges } from '../../../../HighOrderComponents';
import { DateTime } from '../../../../date-time';
import AssetIcon from '../../../AssetIcon';
import Entity from '../../Entity';

function getType(item) {
	const ext = mime.extension(item.getFileMimeType());
	return (
		(ext !== 'bin' && ext
			? ext
			: extname(item.getFileName()).replace(/^\./, '')
		).toUpperCase() || 'Unknown'
	);
}

class File extends Entity {
	render() {
		const {
			props: { item, selection },
			state: { rename },
		} = this;
		const selected = selection.isSelected(item) && !rename;
		const unselectable = !this.canSelect();
		const renameable = item.can('rename');
		const mimeType = item.getFileMimeType();
		const filename = item.getFileName();
		const imgSrc = /image/i.test(mimeType) ? item.getURL() : void 0;
		const image = !imgSrc ? null : imgSrc;

		return (
			<tr
				className={cx('entity entity-row', {
					selected,
					unselectable,
					dragging: this.isInDragSet(),
				})}
				onKeyDown={this.onSelect}
				onClick={this.onSelect}
				onDoubleClick={this.onTrigger}
			>
				<td className="column-name">
					<div
						className={cx('entity-row-item row-file-asset', {
							renameable,
							renaming: rename,
						})}
						role="button"
						aria-label={filename}
						draggable={!rename && this.canDrag() ? true : null}
						tabIndex="0"
						onDragEnd={this.canDrag() && this.onDragEnd}
						onDragStart={this.canDrag() && this.onDragStart}
					>
						<div className="icon-column">
							<div className="file-asset-icon">
								{!imgSrc && (
									<AssetIcon
										mimeType={mimeType}
										href={filename}
										svg
									/>
								)}
								{imgSrc && <img src={image} />}
							</div>
						</div>
						<div className="filename">
							<span>{filename}</span>
							{rename && (
								<input
									type="text"
									ref={this.attachInputRef}
									onBlur={this.onCommitRename}
									onKeyDown={this.onFilenameKeyDown}
									defaultValue={rename}
								/>
							)}
						</div>
					</div>
				</td>

				<td className="column-date">
					<DateTime date={item.getLastModified()} />
				</td>

				<td className="column-type">{getType(item)}</td>
			</tr>
		);
	}
}

export default ItemChanges.compose(File);
