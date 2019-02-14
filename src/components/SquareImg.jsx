import React from 'react';
import PropTypes from 'prop-types';

import {DataURIs} from '../constants';

const {BLANK_IMAGE} = DataURIs;
const isSquare = (w, h) => w === h && ![w, h].some(isNaN) && w > 0;

function letterbox (ctx, image, type) {
	if (!type || type === 'none' || type === 'transparent') {
		return;
	}

	const {width: size} = ctx;

	if (type === 'src') {
		const {naturalWidth: w, naturalHeight: h} = image;
		const scale = Math.max(size / Math.min(w, h), 3);
		const sw = w * scale;
		const sh = h * scale;
		
		ctx.save();
		ctx.translate(size / 2, size / 2);
		ctx.globalAlpha = 0.5;
		ctx.drawImage(image, -sw / 2, -sh / 2, sw, sh);
		ctx.restore();
		return;
	}

	// fillStyle
	ctx.save();
	ctx.fillStyle = type;
	ctx.fillRect(0, 0, size, size);
	ctx.restore();
}

export function getSquareSrc (image, letterboxType) {
	const {src, naturalWidth: w, naturalHeight: h} = image || {};

	if (isSquare(w, h)) {
		return src;
	}

	const DEFAULT_SIZE = 300;
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const size = canvas.width = canvas.height = ctx.width = ctx.height = isNaN(w) ? DEFAULT_SIZE : Math.max(w, h);

	letterbox(ctx, image, letterboxType);
	
	ctx.translate(size / 2, size / 2);
	ctx.drawImage(image, -w / 2, -h / 2);

	return canvas.toDataURL();
}

// Renders a square img from a given src, creating a dataURI via canvas if the given src isn't already a 1:1 aspect ratio.
export default class Square extends React.Component {

	constructor (props) {
		super(props);
		const {src} = props;
		this.image.src = src;
	}
	
	static propTypes = {
		src: PropTypes.string,
		onLoad: PropTypes.func,
		onError: PropTypes.func,
		letterbox: PropTypes.string // 'src', 'none', or a canvas fillStyle
	};
	
	state = {};
	
	get image () {
		if (!this._img) {
			const img = this._img = new Image();
			img.crossOrigin = 'anonymous';
			img.addEventListener('load', this.onLoad);
			img.addEventListener('error', this.props.onError);
		}
		return this._img;
	}
	
	componentDidUpdate = ({src: prevSrc}) => {
		const {src} = this.props;

		if (src !== this.props.src) {
			this.image.src = src;
		}
	}

	componentWillUnmount = () => this.unmounted = true

	onLoad = e => {
		const {target} = e || {};
		const {props: {onLoad}, unmounted} = this;

		if (unmounted) {
			return;
		}
		
		this.setState({
			src: getSquareSrc(target, this.props.letterbox)
		});

		if (typeof onLoad === 'function') {
			onLoad(e);
		}
	}


	render () {
		const {state: {src = BLANK_IMAGE}} = this;
		const props = {
			...this.props,
			src
		};

		delete props.onLoad;
		delete props.onError;
		delete props.letterbox;

		return (
			<img {...props} />
		);
	}
}
