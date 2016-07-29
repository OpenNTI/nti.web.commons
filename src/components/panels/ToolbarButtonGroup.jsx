import React from 'react';

ToolbarButtonGroup.propTypes = {
	children: React.PropTypes.any
};

export default function ToolbarButtonGroup (props) {
	return (
		<span className="toolbar-button-group">
			{props.children}
		</span>
	);
}
