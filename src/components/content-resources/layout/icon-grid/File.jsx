import React from 'react';

import AssetIcon from '../../../AssetIcon';

File.propTypes = {
	item: React.PropTypes.object
};

export default function File (props) {
	const {item} = props;

	const mimeType = item.getFileMimeType();
	const filename = item.getFileName();
	const url = /image/i.test(mimeType) ? item.getURL() : void 0;

	return (
		<div className="file-asset">
			<AssetIcon mimeType={mimeType} src={url} href={filename}/>
			<div className="filename">{filename}</div>
		</div>
	);
}
