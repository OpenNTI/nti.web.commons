import React from 'react';

Link.propTypes = {
	course: React.PropTypes.object,
	unit: React.PropTypes.object,
	outlineNode: React.PropTypes.object
};

export default function Link (props) {
	const {unit, outlineNode} = props;

	const title = outlineNode ? outlineNode.title : 'Unknown';
	const subtitle = unit ? unit.title : '';

	return (
		<div className="resource-viewer-inspector-file-shared-link">
			<h4>{title}</h4>
			<h6>{subtitle}</h6>
		</div>
	);
}
