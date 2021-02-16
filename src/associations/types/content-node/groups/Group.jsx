import './Group.scss';
import React from 'react';
import PropTypes from 'prop-types';

ContentNodeGroup.propTypes = {
	item: PropTypes.object,
	onAdd: PropTypes.func,
};
export default function ContentNodeGroup({ item, onAdd = () => {} }) {
	function onClick() {
		onAdd(item);
	}

	return (
		<div className="content-node-group-item" onClick={onClick}>
			<span
				className="accent-color"
				style={{ background: `#${item.accentColor}` }}
			/>
			<span className="title">{item.title}</span>
		</div>
	);
}
