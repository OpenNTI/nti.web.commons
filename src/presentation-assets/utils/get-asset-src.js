import { URL } from '@nti/lib-commons';

import { ASSET_MAP } from '../components/Asset';

function getResource(scope) {
	if (!scope) {
		return {};
	}

	const resources = scope.PlatformPresentationResources || [];

	for (let resource of resources) {
		if (resource.PlatformName === 'webapp') {
			return resource;
		}
	}

	return null;
}

function getDefaultRoot(scope) {
	return scope.getDefaultRoot ? scope.getDefaultRoot() : '';
}

function getRoot(scope) {
	if (!scope) {
		return '';
	}

	if (scope.presentationroot) {
		return scope.presentationroot;
	}

	const resource = getResource(scope);
	const root = resource && resource.href;

	return root || getDefaultRoot(scope) || '';
}

function getLastModified(scope) {
	const resource = getResource(scope);

	return resource ? resource['Last Modified'] : 0;
}

export default function getAssetSrc(scope, name) {
	const assetPath = ASSET_MAP[name]?.path || `missing-${name}-asset.png`;
	const root = getRoot(scope);
	const lastMod = getLastModified(scope);
	const url = root && URL.resolve(root, assetPath);

	return url ? `${url}?t=${lastMod}` : '';
}
