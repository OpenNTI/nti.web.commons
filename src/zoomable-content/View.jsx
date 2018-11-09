import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isTouch from '@nti/util-detection-touch';
import {Point} from '@nti/lib-commons';

import {
	createTransform,
	// applyScale,
	getLimitingSide,
	getStyleForTransform,
	getScaleForMouseWheel,
	isValidTransform,
	fixTransform,
	Scale,
	Translation
} from './utils';

const stop = (e) => {
	e.preventDefault();
	e.stopPropagation();
};

const pointFromMouse = t => new Point(t.pageX, t.pageY);


export default class NTIZoomable extends React.Component {
	static propTypes = {
		children: PropTypes.any,
		className: PropTypes.string,

		maxScale: PropTypes.number
	}

	static defaultProps = {
		maxScale: 5
	}

	state = {}


	get isImage () {
		const {children} = this.props;
		const child = React.Children.only(children);

		return child.type === 'img';
	}


	get scale () {
		const {transform} = this.state;

		return Scale.getFrom(transform);
	}


	attachFrame = (x) => {
		this.frame = x;
		this.computeInitial();
	}


	attachContent = (x) => {
		this.content = x;
		this.computeInitial();
	}


	onImageLoad = (e) => {
		this.image = e.target;
		this.computeInitial();
	}


	computeInitial () {
		//if we don't have everything we need exit early
		if (!this.frame || !this.content || (this.isImage && !this.image)) { return; }

		const contentSize = {width: this.content.clientWidth, height: this.content.clientHeight};
		const frameSize = {width: this.frame.clientWidth, height: this.frame.clientHeight};

		const limitingSide = getLimitingSide(frameSize, contentSize);

		const scale = limitingSide ? (frameSize[limitingSide] / contentSize[limitingSide]) : 1;

		const newSize = {
			width: Math.floor(contentSize.width * scale),
			height: Math.floor(contentSize.height * scale)
		};

		const translate = {
			x: (frameSize.width / 2) - (newSize.width / 2),
			y: (frameSize.height / 2) - (newSize.height / 2)
		};

		this.setState({
			transform: createTransform({
				scale,
				translate
			}),
			constraints: {
				initialScale: scale,
				maxScale: this.props.maxScale,
				contentSize,
				frameSize
			}
		});
	}


	getOriginPoint () {
		if (!this.container) { return Point.ORIGIN; }

		const rect = this.container.getBoundingClientRect();

		return new Point(rect.top, rect.left);
	}


	getPointRelativeToFrame (point) {
		const origin = this.getOriginPoint();

		return point.minus(origin);
	}


	onMouseDown = (e) => {
		stop(e);
		this.mousePressed = true;
		this.lastMousePoint = pointFromMouse(e);
	}


	clearMouseState = () => {
		this.mousePressed = false;
		this.lastMousePoint = null;
	}


	onMouseMove = (e) => {
		if (!this.mousePressed) { return; }

		stop(e);

		const point = pointFromMouse(e);
		const {x, y} = point.minus(this.lastMousePoint);

		this.lastMousePoint = point;

		this.applyTranslation(x, y);
	}


	onWheel = (e) => {
		stop(e);

		const {constraints} = this.state;
		const scale = getScaleForMouseWheel(e, constraints);

		this.applyScale(scale, pointFromMouse(e));
	}


	applyScale (scale, around) {
		const {transform} = this.state;

		this.applyTransform(Scale.setOn(transform, scale, around));
	}


	applyTranslation (x, y) {
		const {transform} = this.state;

		this.applyTransform(Translation.setOn(transform, x, y));
	}


	applyTransform (transform) {
		const {constraints} = this.state;

		if (isValidTransform(transform, constraints)) {
			this.setState({
				transform: fixTransform(transform, constraints)
			});
		}
	}


	render () {
		const {children, className, ...otherProps} = this.props;
		const child = React.Children.only(children);
		const style = getStyleForTransform(this.state.transform);
		const listeners = {};

		if (isTouch) {
			listeners.onTouchStart = () => {};
			listeners.onTouchMove = () => {};
			listeners.onTouchEnd = () => {};
		} else {
			listeners.onMouseDown = this.onMouseDown;
			listeners.onMouseMove = this.onMouseMove;
			listeners.onMouseUp = this.clearMouseState;
			listeners.onMouseOut = this.clearMouseState;
			listeners.onWheel = this.onWheel;
		}

		return (
			<div {...otherProps} className={cx('nti-zoomable-content', className)} {...listeners} ref={this.attachFrame}>
				<div className="inner" ref={this.attachContent} style={style}>
					{
						this.isImage ?
							React.cloneElement(child, {onLoad: this.onImageLoad}) :
							{child}
					}
				</div>
			</div>
		);

	}
}
