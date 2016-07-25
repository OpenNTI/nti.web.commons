import React from 'react';

Filename.propTypes = {
	item: React.PropTypes.object.isRequired
};

export default function Filename (props) {
	const {item} = props;
	return !item ? null : (
		<div className="resource-viewer-inspector-filename">
			{item.getFileName()}
		</div>
	);
}
