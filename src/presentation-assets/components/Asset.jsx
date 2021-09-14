import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Logger from '@nti/util-logger';

const logger = Logger.get('common:presentation-assets:components:Asset');

const styles = stylesheet`
	.root {
		position: absolute;
		opacity: 0;
	}

	.promo {
		background-image: url(./assets/default-course/course-promo-large-16x9.png);
		background-size: cover;
	}

	.thumb {
		background-image: url(./assets/default-course/contentpackage-thumb-60x60.png);
		background-size: cover;
	}

	.landing {
		background-image: url(./assets/default-course/contentpackage-landing-232x170.png);
		background-size: cover;
	}

	.background {
		background-image: url(./assets/default-course/background.png);
		background-size: cover;
	}
`;

export const ASSET_MAP = {
	thumb: {
		path: 'contentpackage-thumb-60x60.png',
		defaultValue: 'thumb',
	},
	landing: {
		path: 'contentpackage-landing-232x170.png',
		defaultValue: 'landing',
	},
	background: {
		path: 'background.png',
		defaultValue: 'background',
	},
	promo: {
		path: 'course-promo-large-16x9.png',
		defaultValue: 'promo',
	},
	source: {
		path: 'client_image_source.png',
		defaultValue: 'source',
	},
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
function initializeAssetMap() {
	if (typeof document !== 'undefined' && !ASSET_MAP.loaded) {
		const keys = Object.keys(ASSET_MAP);
		ASSET_MAP.loaded = true;

		for (let key of keys) {
			const el = document.createElement('div');

			el.className = cx(
				'course-asset-image',
				styles.root,
				styles[key],
				key
			);

			document.body.appendChild(el);

			try {
				const { backgroundImage } = getComputedStyle(el);

				let [, url] = backgroundImage.match(/url\(([^)]+)\)/) || [];

				url = url?.replace(/(^["'])|(["']$)/g, '');

				ASSET_MAP[key].defaultValue = url;
			} catch (ex) {
				logger.error(
					'Could not resolve image for %s\n%s',
					key,
					ex.stack
				);
			} finally {
				el.remove();
			}
		}
	}
}

export default class Asset extends React.Component {
	static getDefaultURLForType(type) {
		initializeAssetMap();

		return ASSET_MAP[type]?.defaultValue;
	}

	static getAssetRoot(props) {
		const contentPackage = props.contentPackage || props.item;

		if (!contentPackage) {
			return '';
		}

		if (contentPackage.presentationroot) {
			return contentPackage.presentationroot;
		}

		const resource = Asset.getPresentationResource(props);
		const root = resource && resource.href;

		contentPackage.presentationroot =
			root || Asset.getDefaultAssetRoot(contentPackage);

		return contentPackage.presentationroot;
	}

	static getPresentationResource(props) {
		const contentPackage = props.contentPackage || props.item;

		if (!contentPackage) {
			return {};
		}

		const resources = contentPackage.PlatformPresentationResources || [];

		for (let resource of resources) {
			if (resource.PlatformName === 'webapp') {
				return resource;
			}
		}

		return null;
	}

	static getPresentationAsset(contentPackage, type) {
		const asset = Asset.getPresentationResource({ contentPackage });

		if (!asset || !asset.href) {
			return type ? Asset.getDefaultURLForType(type) : '';
		}

		return asset.href + ASSET_MAP[type].path;
	}

	static getDefaultAssetRoot(scope) {
		if (scope.getDefaultAssetRoot) {
			return scope.getDefaultAssetRoot();
		}

		logger.debug(
			'Missing implementation of "getDefaultAssetRoot" in',
			scope
		);
		return '';
	}

	static propTypes = {
		propName: PropTypes.string,
		contentPackage: PropTypes.object,
		item: PropTypes.object,
		type: PropTypes.string,
		computeProps: PropTypes.func,
		children: PropTypes.any,
	};

	getItem({ contentPackage, item } = this.props) {
		return contentPackage || item;
	}

	ref = React.createRef();

	constructor(props) {
		super(props);

		initializeAssetMap();

		this.state = this.computeState(props);
	}

	get propName() {
		return this.props.propName || 'src';
	}

	computeState(props) {
		return {
			resolvedUrl: this.getAsset(props.type, props),
		};
	}

	verifyImage = () => {
		if (this.propName === 'src' && !this.props.computeProps) {
			// assume child handles onError
			return;
		}

		const loaderImage = new Image();

		loaderImage.onerror = this.onImgLoadError;
		loaderImage.src = this.state.resolvedUrl;
	};

	componentDidMount() {
		this.verifyImage();
	}

	componentDidUpdate(prevProps) {
		if (
			this.getItem() !== this.getItem(prevProps) ||
			this.props.type !== prevProps.type
		) {
			this.setState(this.computeState(this.props), this.verifyImage);
		}
	}

	componentWillUnmount() {
		this.unmounted = true;
	}

	getPresentationResource(props) {
		const item = this.getItem(props);
		return (item?.PlatformPresentationResources || []).find(
			resource => resource.PlatformName === 'webapp'
		);
	}

	getAssetRoot(props) {
		const item = this.getItem(props);

		if (!item) {
			return '';
		}

		if (item.presentationroot) {
			return item.presentationroot;
		}

		const resource = this.getPresentationResource(props);
		const root = resource && resource.href;

		item.presentationroot = root || Asset.getDefaultAssetRoot(item);

		return item.presentationroot;
	}

	getLastModified(props) {
		const resource = Asset.getPresentationResource(props);

		return resource ? resource['Last Modified'] : 0;
	}

	getAsset(name, props) {
		const assetPath =
			(ASSET_MAP[name] && ASSET_MAP[name].path) ||
			`missing-${name}-asset.png`;
		const root = Asset.getAssetRoot(props);
		const lastMod = this.getLastModified(props);
		const url = root && URL.resolve(root, assetPath);

		return url && `${url}?t=${lastMod}`;
	}

	onImgLoadError = e => {
		if (this.unmounted) {
			return;
		}

		const {
			state: { resolvedUrl },
			props: { type },
		} = this;
		const { src = resolvedUrl } = e?.target || {};
		const { defaultValue } = ASSET_MAP[type] || {};

		if (
			(e.target === this.ref.current || !document.contains(e.target)) &&
			(!resolvedUrl || equal(src, resolvedUrl)) &&
			defaultValue
		) {
			e?.stopPropagation?.();
			this.setState({ resolvedUrl: defaultValue });
		} else {
			// debugger;
		}
	};

	render() {
		const { children, computeProps } = this.props;
		const child = React.Children.only(children);

		// omit 'src' prop for non-img dom elements (e.g. divs)
		const omitUrlProp =
			!this.props.propName && // prop not explicitly specified…
			typeof child?.type === 'string' && // …and child is a dom element…
			child.type !== 'img'; // …and child isn't an img

		const childProps = {
			...(omitUrlProp ? {} : { [this.propName]: this.state.resolvedUrl }),
			onError: this.onImgLoadError,
			...computeProps?.(this.state.resolvedUrl),
			ref: this.ref,
		};

		return React.cloneElement(child, childProps);
	}
}

function equal(a, b) {
	//if this is ever rendered on the server side, we will need to rethink the source of 'location'
	const normal = x => new URL(x, global.location).toString();
	return normal(a) === normal(b);
}
