import React from 'react';

import AssetIcon from '../../../AssetIcon';

File.propTypes = {
	item: React.PropTypes.object
};

export default function File (props) {
	const {item} = props;

	const mimeType = item.getFileMimeType();
	const filename = item.getFileName();
	const imgSrc = /image/i.test(mimeType) ? item.getURL() : void 0;
	const image = !imgSrc ? null : {backgroundImage: `url(${imgSrc})`};

	return (
		<div className="entity file-asset" role="button" aria-label={filename} tabIndex="0">
			<div className="select">
				<div className="file-asset-icon" style={image}>
					{!imgSrc && ( <AssetIcon mimeType={mimeType} href={filename}/> )}
				</div>
				<div className="filename">{filename}</div>
			</div>
		</div>
	);
}
