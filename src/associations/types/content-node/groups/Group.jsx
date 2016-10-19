import React from 'react';

ContentNodeGroup.propTypes = {
	item: React.PropTypes.object,
	onAdd: React.PropTypes.func
};
export default function ContentNodeGroup ({item, onAdd = () => {}}) {
	function onClick () {
		onAdd(item);
	}

	return (
		<div className="content-node-group-item" onClick={onClick}>
			<span className="accent-color" style={{background: `#${item.accentColor}`}}></span>
			<span className="title">{item.title}</span>
		</div>
	);
}
