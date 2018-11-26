import React from 'react';
import PropTypes from 'prop-types';
import {restProps} from '@nti/lib-commons';

const DISTANCES = {
	top: node => node.scrollTop,
	bottom: node => node.scrollHeight - node.scrollTop - node.clientHeight,
	left: node => node.scrollLeft,
	right: node => node.scrollWidth - node.scrollLeft - node.clientWidth
};

function getBuffer (buffer, side) {
	if (!buffer) { return 0; }
	if (typeof buffer === 'number') { return buffer; }

	return buffer[side] || 0;
}


export default class ScrollBoundaryMonitor extends React.Component {
	static propTypes = {
		buffer: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.shape({
				top: PropTypes.number,
				bottom: PropTypes.number,
				left: PropTypes.number,
				right: PropTypes.number
			})
		]),

		onTop: PropTypes.func,
		onBottom: PropTypes.func,
		onLeft: PropTypes.func,
		onRight: PropTypes.func,

		onScroll: PropTypes.func
	}


	attachNode = (node) => {
		this.node = node;

		if (node) {
			this.checkBoundraries();
		}
	}


	onScroll = (e) => {
		const {onScroll} = this.props;

		this.checkBoundraries(e);

		if (onScroll) {
			onScroll(e);
		}
	}


	checkBoundraries () {
		const {onTop, onBottom, onLeft, onRight} = this.props;

		this.maybeCallForSide('top', onTop);
		this.maybeCallForSide('bottom', onBottom);
		this.maybeCallForSide('left', onLeft);
		this.maybeCallForSide('right', onRight);
	}


	maybeCallForSide (side, fn) {
		this.activeDistances = this.activeDistances || {};

		const {node} = this;

		if (!node || !fn) { return; }

		const sideBuffer = getBuffer(this.props.buffer);
		const distance = DISTANCES[side](node);

		if (distance === this.activeDistances[side]) { return; }

		this.activeDistances[side] = distance;

		if (distance <= sideBuffer) {
			fn(distance);
		}
	}


	render () {
		const props = restProps(ScrollBoundaryMonitor, this.props);

		return (
			<div {...props} onScroll={this.onScroll} ref={this.attachNode} />
		);
	}
}
