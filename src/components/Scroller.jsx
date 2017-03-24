import React from 'react';
import ease from 'eases/cubic-out';
import cx from 'classnames';
import {buffer} from 'nti-commons';

import ScrollerButton from './ScrollerButton';

export default class Scroller extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			canScrollLeft: true,
			canScrollRight: true
		};
	}

	static propTypes = {
		children: React.PropTypes.element.isRequired,
		duration: React.PropTypes.number.isRequired,
		distance: React.PropTypes.number.isRequired,
		className: React.PropTypes.string
	}

	componentDidMount = () => {
		this.updateScrollButtons();
	}

	componentDidUpdate = () => {
		this.updateScrollButtons();
	}

	updateScrollButtons = () => {
		const node = this.child;
		if (!node) {
			return;
		}
		const canScrollLeft = node.scrollLeft > 0;
		const canScrollRight = (node.scrollLeft + node.offsetWidth) < node.scrollWidth;
		if(canScrollLeft !== this.state.canScrollLeft || canScrollRight !== this.state.canScrollRight) {
			this.setState({
				canScrollLeft,
				canScrollRight
			});
		}
	}

	scroll = (amount) => {
		const {duration} = this.props;
		const node = this.child;
		const startScroll = node.scrollLeft;
		let start;
		if (!window.requestAnimationFrame) { // IE9
			node.scrollLeft += amount;
			return;
		}
		const animate = function (timestamp) {
			if(!start) {
				start = timestamp;
			}
			const progress = timestamp - start;
			const percent = progress / duration;
			node.scrollLeft = startScroll + (amount * ease(percent));
			if (progress < duration) {
				return requestAnimationFrame(animate);
			}
			else {
				this.updateScrollButtons();
			}
		}.bind(this);
		requestAnimationFrame(animate);
	}

	render () {
		const {distance, className} = this.props;
		const {canScrollLeft, canScrollRight} = this.state;
		const child = React.Children.only(this.props.children);
		const clone = React.cloneElement(child, {ref: (x) => this.child = x, className: cx(child.props.className, 'scroller-content') , onScroll: buffer(500,this.updateScrollButtons)});
		return (
			<div className={cx('scroller', className)}>
				<ScrollerButton className="left" amount={-distance} onClick={this.scroll} disabled={!canScrollLeft}>&lt;</ScrollerButton>
				{clone}
				<ScrollerButton className="right" amount={distance} onClick={this.scroll} disabled={!canScrollRight}>&gt;</ScrollerButton>
			</div>
		);
	}
}
