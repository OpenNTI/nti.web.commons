import React from 'react';
import PropTypes from 'prop-types';

export default class Resizable extends React.Component {
	static propTypes = {
		width: PropTypes.number,
		height: PropTypes.number,
		title: PropTypes.string,
		children: PropTypes.node,
		onClose: PropTypes.func.isRequired
	};

	static defaultProps = {
		width: 550,
		height: 550,
		title: ''
	};

	constructor (props) {
		super(props);

		const { width, height } = props;

		this.state = {
			width,
			height
		};

		this.previousLeft = width;
		this.previousRight = height;
	}

	onDown = event => {
		this.isDragging = true;
		event.target.setPointerCapture(event.pointerId);
		this.extractPositionDelta(event);
	};

	onMove = event => {
		if (!this.isDragging) {
			return;
		}
		const { left, top } = this.extractPositionDelta(event);

		this.setState(({ width, height }) => ({
			width: width + left,
			height: height + top
		}));
	};

	onUp = () => (this.isDragging = false);

	extractPositionDelta = event => {
		const left = event.pageX;
		const top = event.pageY;
		const delta = {
			left: left - this.previousLeft,
			top: top - this.previousTop
		};
		this.previousLeft = left;
		this.previousTop = top;
		return delta;
	};

	render () {
		const { width, height } = this.state;
		const { title, onClose } = this.props;

		return (
			<div className="resize-box" style={{ width, height }}>
				<div className="resize-header">
					{title}

					<i
						className="resize-close icon-light-x"
						role="button"
						label="Close"
						title="Close"
						tabIndex="0"
						onClick={onClose}
					/>
				</div>
				<div className="resize-content">
					{this.props.children}
				</div>
				<div
					className="resize-control"
					onPointerDown={this.onDown}
					onPointerMove={this.onMove}
					onPointerUp={this.onUp}
				/>
			</div>
		);
	}
}
