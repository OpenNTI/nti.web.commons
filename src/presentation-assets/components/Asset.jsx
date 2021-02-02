import './Asset.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {URL} from '@nti/lib-commons';
import Logger from '@nti/util-logger';

const logger = Logger.get('common:presentation-assets:components:Asset');

// import background from './assets/default-course/background.png';
// import landing from './assets/default-course/contentpackage-landing-232x170.png';
// import thumb from './assets/default-course/contentpackage-thumb-60x60.png';

const ASSET_MAP = {
	thumb: {
		path: 'contentpackage-thumb-60x60.png',
		defaultValue: 'thumb'
	},
	landing: {
		path: 'contentpackage-landing-232x170.png',
		defaultValue: 'landing'
	},
	background: {
		path: 'background.png',
		defaultValue: 'background'
	},
	promo: {
		path: 'course-promo-large-16x9.png',
		defaultValue: 'promo'
	}
};

/**
 * Currently, loading the images from the assets directory will not work due to webpack/rollup
 * issues.  As a workaround, we are defining the images as background-images in a stylesheet, using
 * those computed values to determine the actual path to the image assets and updating the ASSET_MAP
 * to use those values.  Ideally, we would be able to remove this logic and set the defaultValues
 * in ASSET_MAP to the imported values (commented out above)
 *
 * @returns {void}
 */
function initializeAssetMap () {
	if(typeof document !== 'undefined' && !ASSET_MAP.loaded) {

		for(let key of Object.keys(ASSET_MAP)) {
			const el = document.createElement('div');

			el.className = `course-asset-image ${key}`;

			document.body.appendChild(el);

			try {
				const { backgroundImage } = getComputedStyle(el);

				let [,url] = backgroundImage.match(/url\(([^)]+)\)/) || [];

				url = url && url.replace(/(^["'])|(["']$)/g, '');

				ASSET_MAP[key].defaultValue = url;
			}
			catch(ex) {
				logger.error('Could not resolve image for %s\n%s', key, ex.stack);
			}
			finally {
				el.remove();
			}
		}

		ASSET_MAP.loaded = true;
	}
}

export default class Asset extends React.Component {
	static getDefaultURLForType (type) {
		initializeAssetMap();

		return ASSET_MAP[type] && ASSET_MAP[type].defaultValue;
	}


	static getAssetRoot (props) {
		const contentPackage = props.contentPackage || props.item;

		if(!contentPackage) { return ''; }

		if (contentPackage.presentationroot) { return contentPackage.presentationroot; }

		const resource = Asset.getPresentationResource(props);
		const root = resource && resource.href;

		contentPackage.presentationroot = root || Asset.getDefaultAssetRoot(contentPackage);

		return contentPackage.presentationroot;
	}


	static getPresentationResource (props) {
		const contentPackage = props.contentPackage || props.item;

		if (!contentPackage) { return {}; }

		const resources = contentPackage.PlatformPresentationResources || [];

		for (let resource of resources) {
			if (resource.PlatformName === 'webapp') {
				return resource;
			}
		}

		return null;
	}


	static getPresentationAsset (contentPackage, type) {
		const asset = Asset.getPresentationResource({contentPackage});

		if (!asset || !asset.href) {
			return type ? Asset.getDefaultURLForType(type) : '';
		}

		return asset.href + ASSET_MAP[type].path;
	}


	static getDefaultAssetRoot (scope) {
		if (scope.getDefaultAssetRoot) {
			return scope.getDefaultAssetRoot();
		}

		logger.debug('Missing implementation of "getDefaultAssetRoot" in', scope);
		return '';
	}


	static propTypes = {
		propName: PropTypes.string,
		contentPackage: PropTypes.object,
		item: PropTypes.object,
		type: PropTypes.string,
		computeProps: PropTypes.func,
		children: PropTypes.any
	}


	getItem ({contentPackage, item} = this.props) {
		return contentPackage || item;
	}


	constructor (props) {
		super(props);

		initializeAssetMap();

		this.state = this.getStateFor(props);
	}


	getStateFor (props) {
		const { type } = props;

		return {
			resolvedUrl: this.getAsset(type, props)
		};
	}


	verifyImage () {
		const loaderImage = new Image();

		loaderImage.onerror = this.onImgLoadError;
		loaderImage.src = this.state.resolvedUrl;
	}


	componentDidUpdate (prevProps) {
		if (this.getItem() !== this.getItem(prevProps) || this.props.type !== prevProps.type) {
			this.setState(this.getStateFor(this.props), () => {
				this.verifyImage();
			});
		}
	}


	getPresentationResource (props) {
		const item = this.getItem(props);

		if (!item) { return {}; }

		const resources = item.PlatformPresentationResources || [];

		for (let resource of resources) {
			if (resource.PlatformName === 'webapp') {
				return resource;
			}
		}

		return null;
	}


	getAssetRoot (props) {
		const item = this.getItem(props);

		if(!item) { return ''; }

		if (item.presentationroot) { return item.presentationroot; }

		const resource = this.getPresentationResource(props);
		const root = resource && resource.href;

		item.presentationroot = root || Asset.getDefaultAssetRoot(item);

		return item.presentationroot;
	}


	getLastModified (props) {
		const resource = Asset.getPresentationResource(props);

		return resource ? resource['Last Modified'] : 0;
	}


	getAsset (name, props, resolve = false) {
		const assetPath = (ASSET_MAP[name] && ASSET_MAP[name].path) || `missing-${name}-asset.png`;
		const root = Asset.getAssetRoot(props);
		const lastMod = this.getLastModified(props);
		const url = root && URL.resolve(root, assetPath);

		return url && `${url}?t=${lastMod}`;
	}


	componentDidMount () {
		this.verifyImage();
	}


	onImgLoadError = () => {
		const { resolvedUrl } = this.state;

		const defaultValue = ASSET_MAP[this.props.type] && ASSET_MAP[this.props.type].defaultValue;

		this.setState({resolvedUrl: defaultValue || resolvedUrl});
	}


	render () {
		const {children, computeProps, propName} = this.props;
		const child = React.Children.only(children);

		const childProps = computeProps
			? computeProps(this.state.resolvedUrl)
			: {[propName || 'src']: this.state.resolvedUrl};

		return (
			React.cloneElement(child, childProps)
		);
	}
}
