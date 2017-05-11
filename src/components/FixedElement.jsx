import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {buffer, equals} from 'nti-commons';

const SCROLL_STOP_TIMEOUT = 500;
const offsetProp = 'nti-sticky-top-offset';

export default class FixedElement extends React.Component {
	static propTypes = {
		children: PropTypes.any,
		className: PropTypes.string
	}

	attachRef = x => this.el = x

	state = {
		styles: {
			transform: 'none'
		}
	}


	componentDidMount () {
		this.record();
		addEventListener('scroll', this.onWindowScroll);
		addEventListener('resize', this.onResize);
	}


	componentWillUnmount () {
		removeEventListener('scroll', this.onWindowScroll);
		removeEventListener('resize', this.onResize);
	}


	componentDidUpdate () {
		this.record();
	}

	onResize = buffer(500, () => this.record())

	record = () => {
		const oldValues = this.fixedPosition && {...this.fixedPosition};
		const width = this.el && this.el.offsetWidth;

		let top = window[offsetProp] || 0;
		let left = 0;

		let el = this.el;
		do {
			if (el) {
				top += el.offsetTop;
				left += el.offsetLeft;
				el = el.offsetParent;
			}
		}
		while (el && el.offsetParent);

		const newValues = this.fixedPosition = {top, left, width};

		if (oldValues && !equals(newValues, oldValues)) {
			this.forceUpdate();
		}
		// console.log(this.fixedPosition);
	}


	startScrollStopTimer () {
		if (this.scrollStopTimeout) {
			clearTimeout(this.scrollStopTimeout);
		}

		this.scrollStopTimeout = setTimeout(() => this.onScrollStop(), SCROLL_STOP_TIMEOUT);
	}


	onWindowScroll = () => {
		const {isFixed} = this;

		this.startScrollStopTimer();

		if (this.fixedPosition && !isFixed) {
			this.isFixed = true;

			this.setState({
				styles: {
					position: 'fixed',
					top: `${this.fixedPosition.top}px`,
					left: `${this.fixedPosition.left}px`,
					width: `${this.fixedPosition.width}px`
				}
			});
		}
	}


	onScrollStop () {
		const top = window.scrollY;

		delete this.isFixed;

		this.setState({
			styles: {
				transform: `translate3d(0, ${Math.round(top)}px, 0)`
			}
		});
	}


	render () {
		const {className, ...props} = this.props;
		const {styles} = this.state;

		return (
			<div
				className={cx(className, 'fixed-element')}
				style={styles}
				ref={this.attachRef}
				{...props}
			/>
		);
	}
}
