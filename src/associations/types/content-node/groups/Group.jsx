import React from 'react';

ContentNodeGroup.propTypes = {
	item: React.PropTypes.object,
	onAddTo: React.PropTypes.func
};
export default function ContentNodeGroup ({item, onAddTo}) {
	return (
		<span>{item.title}</span>
	);
}
