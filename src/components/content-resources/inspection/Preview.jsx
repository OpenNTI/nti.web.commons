import './Preview.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';

import AssetIcon from '../../AssetIcon';

Preview.propTypes = {
	item: PropTypes.object.isRequired,
};

export default function Preview(props) {
	const { item } = props;
	if (!item) {
		return null;
	}

	const renameable = item.can('rename');
	const mimeType = item.getFileMimeType();
	const filename = item.getFileName();
	const imgSrc = /image/i.test(mimeType) ? item.getURL() : void 0;
	const image = !imgSrc ? null : imgSrc;

	return (
		<div
			className={cx('resource-viewer-inspector-file-preview', {
				renameable,
			})}
		>
			<div className="file-preview-icon">
				{!imgSrc && (
					<AssetIcon mimeType={mimeType} href={filename} svg />
				)}
				{imgSrc && <img src={image} />}
			</div>
		</div>
	);
}
