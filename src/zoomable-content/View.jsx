import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import isTouch from '@nti/util-detection-touch';
import {Point} from '@nti/lib-commons';

import TransformMatrix from './transform-matrix';
import {
	getLimitingSide,
	getScaleForMouseWheel,
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
				.setMaxScale(this.props.MaxScale)
				.setContentSize(contentSize)
				.setBoundarySize(frameSize)
				.scale(scale)
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

		const scale = getScaleForMouseWheel(e);

		this.applyScale(scale, pointFromMouse(e));
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
