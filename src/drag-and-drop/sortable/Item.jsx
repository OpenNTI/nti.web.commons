import PropTypes from 'prop-types';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {DragSource, DropTarget} from 'react-dnd';
import cx from 'classnames';

const ITEM_TYPE = 'sortable-item-type';


const itemSource = {
	beginDrag (props) {
		return {
			index: props.index,
			item: props.item
		};
	},
	canDrag (props/*, monitor */) {
		return !!props.moveItem && !props.locked;
	},
	endDrag (props) {
		const {onDragEnd} = props;
		if (onDragEnd) {
			onDragEnd();
		}
	}
};

const itemTarget = {

	hover (props, monitor, component) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return;
		}

		// can't move the item
		if (typeof props.moveItem !== 'function' || props.locked) {
			return;
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect(); // eslint-disable-line react/no-find-dom-node

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

		// Determine mouse position
		const clientOffset = monitor.getClientOffset();

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;

		// Only perform the move when the mouse has crossed half of the item's height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return;
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return;
		}

		// Time to actually perform the action
		props.moveItem(dragIndex, hoverIndex);

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex;

	}
};

function collect (connect, monitor) {
	return {
		connectDragPreview: connect.dragPreview(),
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	};
}

function collectDrop (connect) {
	return {
		connectDropTarget: connect.dropTarget()
	};
}

class SortableItem extends React.Component {

	static propTypes = {
		index: PropTypes.number.isRequired,
		moveItem: PropTypes.func,
		className: PropTypes.string,
		isDragging: PropTypes.bool,
		connectDragSource: PropTypes.func,
		connectDropTarget: PropTypes.func,
		connectDragPreview: PropTypes.func,
		children: PropTypes.any
	}

	static defaultProps = {
		connectDragSource: (x) => x,
		connectDropTarget: (x) => x,
	}

	render () {

		const {
			connectDragSource,
			connectDropTarget,
			connectDragPreview,
			...others
		} = this.props;

		const content = connectDragSource(connectDropTarget(
			ListItem(others) // no jsx here because the dnd connectors only work with native element nodes.
		));

		return connectDragPreview ? connectDragPreview(content) : content;
	}
}
const dragSource = DragSource(ITEM_TYPE, itemSource, collect)(SortableItem);
const Sortable = DropTarget(ITEM_TYPE, itemTarget, collectDrop)(dragSource);

ListItem.propTypes = {
	className: PropTypes.string,
	isDragging: PropTypes.bool,
	children: PropTypes.any
};

function ListItem ({className, children, isDragging: dragging}) {
	const classes = cx('sortable-item', className, {dragging});

	return (
		<li className={classes}>
			{children}
		</li>
	);
}


Item.propTypes = {
	readOnly: PropTypes.bool
};

export default function Item (props) {
	const C = props.readOnly ? ListItem : Sortable;
	return <C {...props} />;
}
