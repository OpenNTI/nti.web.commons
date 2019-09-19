import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {restProps} from '@nti/lib-commons';

import {DataURIs} from '../constants';
import {ForwardRef} from '../decorators';

import {getTransforms} from './transforms';
import Base from './Base';
import {AspectRatios} from './Constants';
import Container from './Container';

const {BLANK_IMAGE} = DataURIs;
const t = scoped('common.image.View', {
	alt: 'Image'
});

export default
@ForwardRef('imageRef')
class NTIImage extends React.Component {
	static AspectRatios = AspectRatios
	static Container = Container

	static propTypes = {
		src: PropTypes.string,
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

	get loader () {
		if (!this.#loader) {
			const loader = this.#loader = new Image();
			loader.crossOrigin = 'anonymous';
			
			const onLoad = (e) => this.onLoad(e);
			const onError = (e) => this.onError(e);

			loader.addEventListener('load', onLoad);
			loader.addEventListener('error', onError);

			this.cleanupLoader = () => {
				loader.removeEventListener('load', onLoad);
				loader.removeEventListener('error', onError);
				this.#loader = null;
				delete this.cleanupLoader();
			};
		}

		return this.#loader;
	}

	componentDidMount () {
		const {src, fallback} = this.props;

		this.loader.src = src || fallback;
	}

	componentWillUnmount () {
		this.unmounted = true;
	}

	componentDidUpdate (prevProps) {
		const {src} = this.props;
		const {src: prevSrc} = prevProps;

		if (src !== prevSrc) {
			this.setState({src: null});
			this.loader.src = src;
		}
	}

	onLoad (e) {
		const {target} = e || {};
		const {onLoad} = this.props;

		if (this.unmounted) { return; }

		this.setState({
			src: target.src
		});

		if (onLoad) {
			onLoad(e);
		}
	}

	onError (e) {
		const {target} = e || {};
		const {onError, fallback} = this.props;

		//If we haven't tried the fallback yet, try it.
		if (target.src !== fallback && fallback) {
			this.loader.src = fallback;
			return;
		}

		//We already tried to load the fallback and it failed
		if (onError) {
			onError(e);
		}

		this.setState({
			src: BLANK_IMAGE
		});
	}


	render () {
		const {imageRef} = this.props;
		const {currentSrc, alt} = this;
		const otherProps = restProps(NTIImage, this.props);

		const transforms = getTransforms(this.props).reverse();

		let cmp = (<Base src={currentSrc} alt={alt} imageRef={imageRef} {...otherProps} />);

		for (let Transform of transforms) {
			cmp = (
				<Transform {...this.props} src={currentSrc} _loader={this.loader} >
					{cmp}
				</Transform>
			);
		}

		return cmp;
	}
}
