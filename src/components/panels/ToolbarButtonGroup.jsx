import React from 'react';
import PropTypes from 'prop-types';

ToolbarButtonGroup.propTypes = {
	children: PropTypes.any
};

export default function ToolbarButtonGroup (props) {
	return (
		<span className="toolbar-button-group">
			{props.children}
		</span>
	);
}
