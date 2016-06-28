import React from 'react';

Folder.propTypes = {
	item: React.PropTypes.object
};

export default function Folder (props) {
	const {item} = props;

	const filename = item.getFileName();

	return (
		<div className="entity folder-asset" role="button" aria-label={filename} tabIndex="0">
			<i className="icon-folder small"/>
			<span className="filename" tabIndex="0">{filename}</span>
		</div>
	);
}
