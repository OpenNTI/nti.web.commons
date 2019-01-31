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

		window: PropTypes.bool,

		onTop: PropTypes.func,
		onBottom: PropTypes.func,
		onLeft: PropTypes.func,
		onRight: PropTypes.func,

		onScroll: PropTypes.func
	}
	
	componentDidMount () {
		const {window: win} = this.props;

		if (win) {
			const scroller = document.scrollingElement || document.documentElement;
			this.attachNode(scroller, true);
			window.addEventListener('scroll', this.onScroll);
			this.stopListening = () => {
				window.removeEventListener('scroll', this.onScroll);
				if (this.node === scroller) {
					delete this.node;
				}
			};
		}
	}

	componentWillUnmount () {
		if (this.stopListening) {
			this.stopListening();
			delete this.stopListening;
		}
	}

	attachNode = (node, silent) => {
		this.node = node;

		if (node && !silent) {
			this.checkBoundaries();
		}
	}

	getOffsetTop = () => {
		if (this.node) {
			return this.node.offsetTop;
		}
	}

	canScroll = () => {
		if (this.node) {
			return this.node.scrollHeight > this.node.clientHeight;
		}
	}

	setScrollTop = (scrollTop) => {
		if (this.node) {
			this.node.scrollTop = scrollTop;
		}
	}


	onScroll = (e) => {
		const {onScroll} = this.props;

		this.checkBoundaries(e);

		if (onScroll) {
			onScroll(e);
		}
	}


	checkBoundaries () {
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
		const {window: win, children} = this.props;
		const props = restProps(ScrollBoundaryMonitor, this.props);

		return win ? children : (
			<div {...props} onScroll={this.onScroll} ref={this.attachNode} />
		);
	}
}
