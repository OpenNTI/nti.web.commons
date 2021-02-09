import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {restProps} from '@nti/lib-commons';

import {DataURIs} from '../constants';
import {ForwardRef} from '../decorators';


import {resolveImage} from './utils';
import * as srcsetUtils from './srcset';
import {getTransforms} from './transforms';
import Base from './Base';
import {AspectRatios} from './Constants';
import Container from './Container';
import Error from './Error';
import LightBox from './lightbox';

const {BLANK_IMAGE} = DataURIs;
const t = scoped('common.image.View', {
	alt: 'Image'
});

class NTIImage extends React.Component {
	static srcset = srcsetUtils
	static AspectRatios = AspectRatios
	static Container = Container
	static Error = Error
	static Lightbox = LightBox

	static propTypes = {
		src: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.array,
		]),
		srcset: PropTypes.arrayOf(
			PropTypes.shape({
				src: PropTypes.string,
				query: PropTypes.string
			})
		),
		alt: PropTypes.string,

		placeholder: PropTypes.string,
		fallback: PropTypes.string,

		onLoad: PropTypes.func,
		onError: PropTypes.func,

		imageRef: PropTypes.func
	}

	#loader = null;

	state = {};

	get currentSrc () {
		const {placeholder} = this.props;
		const {src} = this.state;

		if (!src) { return placeholder || BLANK_IMAGE; }

		return src || BLANK_IMAGE;
	}

	get alt () {
		const {alt} = this.props;

		return alt || t('alt');
	}

	componentDidMount () {
		this.setupSource();
	}

	componentWillUnmount () {
		this.unmounted = true;
	}

	componentDidUpdate (prevProps) {
		const {src} = this.props;
		const {src: prevSrc} = prevProps;

		if (src !== prevSrc) {
			this.setState({src: null});
			this.setupSource();
		}
	}

	async setupSource () {
		const {src, fallback, srcset, onLoad, onError} = this.props;
		const started = Date.now();

		this.currentLoadStarted = started;

		try {
			this.#loader = await resolveImage(src, srcset, fallback);

			if (this.unmounted || this.currentLoadStarted !== started ) { return; }

			this.setState({
				src: this.#loader.currentSrc || this.#loader.src
			});

			if (onLoad) {
				onLoad(this.#loader);
			}
		} catch (e) {
			this.setState({
				src: BLANK_IMAGE
			});

			if (onError) {
				onError(e);
			}
		}
	}


	render () {
		const {imageRef} = this.props;
		const {currentSrc, alt} = this;
		const otherProps = restProps(NTIImage, this.props);

		const transforms = getTransforms(this.props).reverse();

		let cmp = (<Base src={currentSrc} alt={alt} imageRef={imageRef} {...otherProps} />);

		for (let Transform of transforms) {
			cmp = (
				<Transform {...this.props} src={currentSrc} _loader={this.#loader} >
					{cmp}
				</Transform>
			);
		}

		return cmp;
	}
}

export default ForwardRef('imageRef')(NTIImage);
