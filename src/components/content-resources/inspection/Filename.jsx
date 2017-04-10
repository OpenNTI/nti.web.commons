import React from 'react';
import PropTypes from 'prop-types';

Filename.propTypes = {
	item: PropTypes.object.isRequired
};

export default function Filename (props) {
	const {item} = props;
	return !item ? null : (
		<div className="resource-viewer-inspector-filename">
			{item.getFileName()}
		</div>
	);
}
