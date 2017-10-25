import React from 'react';
import PropTypes from 'prop-types';
import {URL} from 'nti-commons';
import Logger from 'nti-util-logger';

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
		path: 'course-promo-large-16x9.png'
	}
};

/**
 * Currently, loading the images from the assets directory will not work due to webpack/rollup
 * issues.  As a workaround, we are defining the images as background-images in a stylesheet, using
 * those computed values to determine the actual path to the image assets and updating the ASSET_MAP
 * to use those values.  Ideally, we would be able to remove this logic and set the defaultValues
 * in ASSET_MAP to the imported values (commented out above)
 *
 * @return {void}
 */
function initializeAssetMap () {
	if(typeof document !== 'undefined' && !ASSET_MAP.loaded) {
		ASSET_MAP.loaded = true;

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
	}
}

export default class Asset extends React.Component {
	static propTypes = {
		propName: PropTypes.string,
		contentPackage: PropTypes.object,
		type: PropTypes.string,
		children: PropTypes.any
	}

	constructor (props) {
		super(props);

		const { type } = props;

		initializeAssetMap();

		this.state = {
			resolvedUrl: this.getAsset(type)
		};
	}

	getDefaultAssetRoot (scope) {
		if (scope.getDefaultAssetRoot) {
			return scope.getDefaultAssetRoot();
		}

		console.warn('Missing implementation of "getDefaultAssetRoot" in', scope); //eslint-disable-line no-console
		return '';
	}

	getAssetRoot () {
		const { contentPackage } = this.props;

		if (contentPackage.presentationroot) { return contentPackage.presentationroot; }

		let resources = contentPackage.PlatformPresentationResources || [],
			root;

		resources.every(
			resource=> !(root = (resource.PlatformName === 'webapp') ? resource.href : root)
		);

		contentPackage.presentationroot = root || this.getDefaultAssetRoot(contentPackage);

		return contentPackage.presentationroot;
	}

	getAsset (name, resolve = false) {
		const assetPath = (ASSET_MAP[name] && ASSET_MAP[name].path) || `missing-${name}-asset.png`;
		const root = this.getAssetRoot();
		return root && URL.resolve(root, assetPath);
	}

	componentDidMount () {
		const loaderImage = new Image();

		loaderImage.onerror = this.onImgLoadError;
		loaderImage.src = this.state.resolvedUrl;
	}

	onImgLoadError = () => {
		const { resolvedUrl } = this.state;

		const defaultValue = ASSET_MAP[this.props.type] && ASSET_MAP[this.props.type].defaultValue;

		this.setState({resolvedUrl: defaultValue || resolvedUrl});
	}

	render () {
		const {children, propName} = this.props;
		const child = React.Children.only(children);

		return (
			React.cloneElement(child, {[propName || 'src']: this.state.resolvedUrl})
		);
	}
}
