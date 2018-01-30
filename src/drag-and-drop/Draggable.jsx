import React from 'react';
import PropTypes from 'prop-types';
import Logger from 'nti-util-logger';

import DataTransfer from './utils/DataTransfer';

const log = Logger.get('common:draganddrop:Draggable');

export default class Draggable extends React.Component {
	static propTypes = {
		data: PropTypes.any,
		onDragStart: PropTypes.func,
		onDragEnd: PropTypes.func,
		onMouseDown: PropTypes.func,
		onMouseUp: PropTypes.func,
		children: PropTypes.node
	}


	attachChildRef = x => this.child = x;

	constructor (props) {
		super(props);

		this.setDataForTransfer(props.data);
	}


	get domNode () {
		const {child} = this;

		return child && child.getDomNode ? child.getDomNode() : child;
	}


	get childProp () {
		const {children} = this.props;

		return React.Children.only(children);
	}


	componentWillReceiveProps (nextProps) {
		const {data:newData} = nextProps;
		const {data:oldData} = this.props;

		if (newData !== oldData) {
			this.setDataForTransfer(newData);
		}
	}


	setDataForTransfer (data) {
		if (!Array.isArray(data)) {
			data = [];
		}

		this.dataTransfer = new DataTransfer();

		for (let d of data) {
			if (d != null) {
				this.dataTransfer.setData(d);
			}
		}
	}


	onDragStart = (e) => {
		e.stopPropagation();

		const {domNode} = this;
		const {onDragStart} = this.props;
		const {dataTransfer} = e;

		dataTransfer.effectAllowed = 'all';
		dataTransfer.dropEffect = 'move';

		if (this.dataTransfer) {
			this.dataTransfer.forEach((key, value) => {
				dataTransfer.setData(key, value);
			});
		}

		this.isDragging = true;

		domNode.classList.add('dragging');
		domNode.style.position = 'relative';
		domNode.style.zIndex = 0;

		if (onDragStart) {
			onDragStart(e);
		}
	}


	onDragEnd = (e) => {
		const {domNode} = this;
		const {onDragEnd} = this.props;

		this.isDragging = false;

		domNode.classList.remove('dragging');
		domNode.style.position = '';
		domNode.style.zIndex = '';

		if (onDragEnd) {
			onDragEnd(e);
		}
	}


	setDraggable (add) {
		const {domNode} = this;
		const listener = add ? 'addEventListener' : 'removeEventListener';

		if (!domNode) {
			log.error('No DomNode available for draggable.');
			return;
		}

		if (add) {
			domNode.setAttribute('draggable', true);
		} else {
			domNode.removeAttribute('draggable');
		}

		domNode[listener]('dragstart', this.onDragStart);
		domNode[listener]('dragend', this.onDragEnd);
	}


	onMouseDown = (e) => {
		const {childProp} = this;

		e.stopPropagation();

		const {onMouseDown} = this.props;

		if (onMouseDown) {
			onMouseDown(e);
		}

		if (childProp.props.onMouseDown) {
			childProp.props.onMouseDown(e);
		}

		this.setDraggable(true);
	}


	onMouseUp = (e) => {
		const {onMouseUp} = this.props;
		const {childProp} = this;

		if (onMouseUp) {
			onMouseUp(e);
		}

		if (childProp.props.onMouseUp) {
			childProp.props.onMouseUp(e);
		}

		this.setDraggable(false);
	}


	render () {
		const {children, ...props} = this.props;
		const child = React.Children.only(children);

		props.onMouseDown = this.onMouseDown;
		props.onMouseUp = this.onMouseUp;

		delete props.data;
		delete props.onDragStart;
		delete props.onDragEnd;

		//TODO: don't hijack the ref
		return (
			React.cloneElement(child, {...props, ref: this.attachChildRef})
		);
	}
}
