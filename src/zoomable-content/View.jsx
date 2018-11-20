import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isTouch from '@nti/util-detection-touch';
import {Point} from '@nti/lib-commons';

import TransformMatrix from './transform-matrix';
import {
	getLimitingSide,
	getScaleForMouseWheel,
	getScaleForPointMoves,
	getFocusForPoints
} from './utils';

const stop = (e) => {
	e.preventDefault();
	e.stopPropagation();
};

const pointFromMouse = t => new Point(t.pageX, t.pageY);
const pointFromTouch = t => new Point(t.pageX, t.pageY, t.identifier);

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

		this.setState({
			transform: TransformMatrix()
				.setMinScale(scale)
				.setMaxScale(this.props.maxScale)
				.setContentSize(contentSize)
				.setBoundarySize(frameSize)
				.scale(scale)
		});
	}

	//Mouse events
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

		const scale = getScaleForMouseWheel(e);

		this.applyScale(scale, pointFromMouse(e));
	}


	//Touch Events
	onTouchStart = (e) => {
		this.activeTouches = this.activeTouches || {};

		for (let touch of e.changedTouches) {
			const p = pointFromTouch(touch);

			this.activeTouches[p.id] = p;
		}
	}


	onTouchMove = (e) => {
		this.activeTouches = this.activeTouches || {};

		const touches = e.changedTouches;

		if (touches.length > 1) {
			this.onMultiTouchMove(Array.from(touches).map(t => pointFromTouch(t)));
		} else {
			this.onSingleTouchMove(pointFromTouch(touches[0]));
		}

		for (let touch of touches) {
			const p = pointFromTouch(touch);

			this.activeTouches[p.id] = p;
		}
	}


	onSingleTouchMove (point) {
		this.activeTouches = this.activeTouches || {};

		const originalPoint = this.activeTouches[point.id];
		const {x, y} = point.minus(originalPoint);

		this.applyTranslation(x, y);
	}


	onMultiTouchMove (points) {
		this.activeTouches = this.activeTouches || {};

		const originalPoints = points.map(p => this.activeTouches[p.id]);

		const scale = getScaleForPointMoves(points, originalPoints);
		const around = getFocusForPoints(points);

		this.applyScale(scale, around);
	}


	onTouchEnd = (e) => {
		this.activeTouches = this.activeTouches || {};

		for (let touch of e.changedTouches) {
			delete this.activeTouches[touch.identitifier];
		}
	}


	applyScale (scale, around) {
		const {transform} = this.state;

		this.applyTransform(transform.scale(scale, around));
	}


	applyTranslation (x, y) {
		const {transform} = this.state;

		this.applyTransform(transform.translate(x, y));
	}


	applyTransform (newTransform) {
		const {transform} = this.state;

		if (!transform.isEqual(newTransform)) {
			this.setState({
				transform: newTransform
			});
		}
	}


	render () {
		const {children, className, ...otherProps} = this.props;
		const {transform} = this.state;
		const child = React.Children.only(children);
		const style = transform ? transform.asCSSTransform() : TransformMatrix().asCSSTransform();
		const listeners = {};

		if (isTouch) {
			listeners.onTouchStart = this.onTouchStart;
			listeners.onTouchMove = this.onTouchMove;
			listeners.onTouchEnd = this.onTouchEnd;
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
