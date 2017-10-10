import PropTypes from 'prop-types';
import React from 'react';
import {DragLayer} from 'react-dnd';

import Item from './Item';

const LAYER_STYLES = {
	position: 'fixed',
	pointerEvents: 'none',
	zIndex: 100,
	left: 0,
	top: 0,
	width: '100%',
	height: '100%'
};


class ContextWrapper extends React.Component {

	static propTypes = {
		dragDropManager: PropTypes.any
	}

	static childContextTypes = {
		dragDropManager: PropTypes.any
	}

	getChildContext () {
		const {dragDropManager} = this.props;
		return {
			dragDropManager
		};
	}

	render () {
		const {...props} = this.props;

		delete props.dragDropManager;

		return (
			<ol {...props}/>
		);
	}
}


class SortDragLayer extends React.Component {
	static propTypes = {
		item: PropTypes.object,
		itemType: PropTypes.string,
		currentOffset: PropTypes.shape({
			x: PropTypes.number.isRequired,
			y: PropTypes.number.isRequired
		}),
		isDragging: PropTypes.bool.isRequired,
		getChildAtIndex: PropTypes.func
	}

	static contextTypes = {
		dragDropManager: PropTypes.any.isRequired
	}

	renderItem (item) {
		if (this.props.getChildAtIndex) {
			const child = this.props.getChildAtIndex(item.index);
			return <Item index={item.index}>{child}</Item>;
		}
		return <Item index={item.index}><span>OH HAI</span></Item>;
	}

	render () {
		const { item, isDragging } = this.props;
		if (!isDragging) {
			return null;
		}

		const style = getItemStyles(this.props);

		return (

			<div style={LAYER_STYLES} className="sortable-item-drag-ghost">
				<ContextWrapper style={style} {...this.context}>
					{isDragging && this.renderItem(item)}
				</ContextWrapper>
			</div>

		);
	}
}


function getItemStyles (props) {
	const { currentOffset } = props;
	if (!currentOffset) {
		return {
			display: 'none'
		};
	}

	const { x, y } = currentOffset;
	const transform = `translate3d(${x}px, ${y}px, 0)`;
	return {
		transform: transform,
		WebkitTransform: transform, //andriod 4.4, iOS8
		width: 370
	};
}


function collect (monitor) {
	return {
		item: monitor.getItem(),
		currentOffset: monitor.getSourceClientOffset(),
		isDragging: monitor.isDragging()
	};
}

export default DragLayer(collect)(SortDragLayer);
