import './SharedLink.scss';
import React from 'react';
import PropTypes from 'prop-types';

Link.propTypes = {
	course: PropTypes.object,
	unit: PropTypes.object,
	outlineNode: PropTypes.object,
};

export default function Link(props) {
	const { unit, outlineNode } = props;

	const title = outlineNode ? outlineNode.title : 'Unknown';
	const subtitle = unit ? unit.title : '';

	return (
		<div className="resource-viewer-inspector-file-shared-link">
			<h4>{title}</h4>
			<h6>{subtitle}</h6>
		</div>
	);
}
