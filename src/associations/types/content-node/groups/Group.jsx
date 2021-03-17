import './Group.scss';
import React from 'react';
import PropTypes from 'prop-types';

export const ContentNodeGroup = React.forwardRef(
	({ item, onAdd = () => {} }, ref) => {
		return (
			<div
				ref={ref}
				className="content-node-group-item"
				onClick={() => onAdd(item)}
			>
				<span
					className="accent-color"
					style={{ background: `#${item.accentColor}` }}
				/>
				<span className="title">{item.title}</span>
			</div>
		);
	}
);

ContentNodeGroup.propTypes = {
	item: PropTypes.object,
	onAdd: PropTypes.func,
};

export default ContentNodeGroup;
