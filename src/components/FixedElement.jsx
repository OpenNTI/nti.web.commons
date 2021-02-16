import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { buffer, equals } from '@nti/lib-commons';

const SCROLL_STOP_TIMEOUT = 500;

export default class FixedElement extends React.Component {
	static propTypes = {
		children: PropTypes.any,
		className: PropTypes.string,
	};

	attachRef = x => (this.el = x);

	state = {
		styles: {
			transform: 'none',
		},
	};

	componentDidMount() {
		this.record();

		this.lastKnownHeight = this.getCurrentHeight();

		global.addEventListener('scroll', this.onWindowScroll);
		global.addEventListener('resize', this.onResize);
	}

	getCurrentHeight() {
		const body = document.body,
			html = document.documentElement;

		return Math.max(
			body.scrollHeight,
			body.offsetHeight,
			html.clientHeight,
			html.scrollHeight,
			html.offsetHeight
		);
	}

	componentWillUnmount() {
		global.removeEventListener('scroll', this.onWindowScroll);
		global.removeEventListener('resize', this.onResize);
	}

	componentDidUpdate() {
		this.record();
	}

	onResize = buffer(500, () => this.record());

	record = () => {
		const oldValues = this.fixedPosition && { ...this.fixedPosition };
		const rect = this.el
			? this.el.getBoundingClientRect()
			: { top: 0, left: 0, width: 0 };

		this.fixedPosition = {
			top: rect.top,
			left: rect.left,
			width: rect.width,
		};

		this.rectHeight = rect.height;

		if (oldValues && !equals(this.fixedPosition, oldValues)) {
			this.forceUpdate();
		}
	};

	startScrollStopTimer() {
		if (this.scrollStopTimeout) {
			clearTimeout(this.scrollStopTimeout);
		}

		this.scrollStopTimeout = setTimeout(
			() => this.onScrollStop(),
			SCROLL_STOP_TIMEOUT
		);
	}

	onWindowScroll = () => {
		const { isFixed } = this;

		const currHeight = this.getCurrentHeight();

		if (currHeight !== this.lastKnownHeight) {
			this.lastKnownHeight = currHeight;

			this.onScrollStop();
		} else {
			this.startScrollStopTimer();
		}

		if (this.fixedPosition && !isFixed && this.rectHeight !== 0) {
			this.isFixed = true;

			this.setState({
				styles: {
					position: 'fixed',
					top: `${this.fixedPosition.top}px`,
					left: `${this.fixedPosition.left}px`,
					width: `${this.fixedPosition.width}px`,
				},
			});
		}
	};

	onScrollStop() {
		const top =
			window.scrollY == null ? window.pageYOffset : window.scrollY;

		delete this.isFixed;

		this.setState({
			styles: {
				transform: `translate3d(0, ${Math.round(top)}px, 0)`,
			},
		});
	}

	render() {
		const { className, ...props } = this.props;
		const { styles } = this.state;

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
