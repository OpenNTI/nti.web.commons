import PropTypes from 'prop-types';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {DragSource, DropTarget} from 'react-dnd';
import cx from 'classnames';

const ITEM_TYPE = 'sortable-item-type';


const itemSource = {
	beginDrag (props) {
		return {
			id: props.id,
			index: props.index
		};
	},
	canDrag (props/*, monitor */) {
		return !!props.moveItem;
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
		if (typeof props.moveItem !== 'function') {
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

		// Only perform the move when the mouse has crossed half of the items height
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

class Item extends React.Component {

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
			index,
			moveItem,
			className,
			isDragging,
			connectDragSource,
			connectDropTarget,
			connectDragPreview,
			children
		} = this.props;

		const showDragHandle = !!moveItem;

		const classes = cx('sortable-item', className, {dragging: isDragging});

		const content = connectDragSource(connectDropTarget(
			<li className={classes}>
				<span className="position">{index + 1}</span>
				<div className="sortable-item-content">
					{children}
				</div>
				{showDragHandle && <span className="drag-handle" />}
			</li>
		));

		return connectDragPreview ? connectDragPreview(content) : content;
	}
}
const dragSource = DragSource(ITEM_TYPE, itemSource, collect)(Item);
export default DropTarget(ITEM_TYPE, itemTarget, collectDrop)(dragSource);
